import type { Register } from 'claude-code'

// A file another chat edited less than this long ago is a collision risk.
const WINDOW_MS = 30 * 60 * 1000

type Touch = { session: string; at: number }

export const register: Register = on => {
  on('tool.call', async ($, e, next) => {
    if (e.tool !== 'Edit' && e.tool !== 'Write') {
      return next(e)
    }

    const key = `touch:${e.file_path}`
    const session = await $.session.id()
    const last = (await $.store.get(key)) as Touch | undefined
    const now = await $.clock.now()

    if (last !== undefined && last.session !== session && now - last.at < WINDOW_MS) {
      const minutes = Math.max(1, Math.round((now - last.at) / 60000))
      // A dismissed dialog, or a run with no one to ask, rejects: that counts as Cancel.
      const choice = await $.ui
        .ask(`Another chat edited ${e.file_path} ${minutes} min ago. Edit it here too?`, ['Proceed', 'Cancel'])
        .catch(() => 'Cancel')

      if (choice !== 'Proceed') {
        return {
          deny: `Collision guard held this edit: another chat changed ${e.file_path} ${minutes} min ago, and the user chose not to continue. Do not retry unless the user asks you to.`,
        }
      }
    }

    const ran = await next(e)
    if (ran.deny === undefined && ran.isError !== true) {
      const touch: Touch = { session, at: await $.clock.now() }
      await $.store.set(key, touch)
    }

    return ran
  })
}
