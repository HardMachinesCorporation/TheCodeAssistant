import { commands, ExtensionContext, Chat } from "vscode";
import { HmcPanel } from "./panels/HmcPanel";
import { Chart } from "grommet";
import{ hmcChat} from "./panels/HmcChat";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showChatCommand = commands.registerCommand("hmc.showChat", () => {
    HmcPanel.render(context.extensionUri);
  });

  const hmcChatParticipant = Chat.createChatParticipant("hmc.chat", hmcChat.intialize)

  // Add command to the extension context
  context.subscriptions.push(hmcChatParticipant, showChatCommand);
}
