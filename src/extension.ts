// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as f from "file-url";
import { dirname, normalize } from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const barItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  barItem.text = "xxxxxx";
  barItem.tooltip = "Barney";
  barItem.show();

  const backup = () => {
    try {
      fs.statSync(htmlBackupPath);
    } catch (err) {
      if (err) {
        fs.writeFileSync(htmlBackupPath, fs.readFileSync(htmlFilePath));
      }
    }
  };

  const prepareUninstall = () => {
    fs.unlinkSync(htmlFilePath);
    fs.renameSync(htmlBackupPath, htmlFilePath);
  };

  const htmlDirPath = normalize(
    `${dirname(
      (require.main as NodeModule).filename
    )}/vs/code/electron-browser/workbench`
  );
  const htmlFilePath = normalize(`${htmlDirPath}/workbench.html`);
  const htmlBackupPath = normalize(`${htmlDirPath}/index-barney-backup.html`);

  // make a backup UI structure for user
  backup();

  // refresh command
  let refreshCMD = vscode.commands.registerCommand(
    "extension.BarneyRefresh",
    () => {
      vscode.window
        .showInformationMessage(
          "Barney: refresh successfully,reload Window to take effect.",
          "Yes, Reload Window!!"
        )
        .then((msg) => {
          msg === "Yes, Reload Window!!" &&
            vscode.commands.executeCommand("workbrench.action.reloadWindow");
        });
    }
  );

  // uninstall command
  let uninstallCMD = vscode.commands.registerCommand(
    "extension.BarneyUninstall",
    () => {
      prepareUninstall();
      vscode.window.showInformationMessage("Barney: I will miss you~");
    }
  );

  // reload command
  let reloadCMD = vscode.commands.registerCommand(
    "extension.BarneyReload",
    () => {
      try {
        fs.statSync(htmlBackupPath);
      } catch (err) {
        if (err) {
          vscode.window.showInformationMessage(
            "Barney: something went wrong when reloading"
          );
          return;
        }
      }
      prepareUninstall();
      backup();

      vscode.window
        .showInformationMessage(
          "Barney: reload successful, reload Window to take effect.",
          "Yes, Reload Window!!"
        )
        .then((msg) => {
          msg === "Yes, Reload Window!!" &&
            vscode.commands.executeCommand("workbrench.action.reloadWindow");
        });
    }
  );

  context.subscriptions.push(refreshCMD);
  context.subscriptions.push(uninstallCMD);
  context.subscriptions.push(reloadCMD);
  //   context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
