# mod-doctor

Mod doctor audits the mods you have installed. Run `/mod-doctor` to open its pane. It lists your plugins with `claude plugin list`, runs `claude plugin validate` on each enabled plugin that has a folder, and shows each one's verdict, its warnings and errors, and the hooks and calls it declares. Press Refresh to run the audit again. It flags three things in plain words: a plugin that fails validation, two or more enabled plugins that hook tool.call (their order matters), and one plugin name enabled under two marketplaces. Built-in and synced plugins have no folder, so the pane lists them as not validated.

The validator checks structure and the declared calls, not behaviour. A pass means the manifest and hooks load, not that a mod works. Costs nothing: it runs only read-only commands and makes no model calls. The audit takes a few seconds per enabled mod, and each run reads the current install state.
