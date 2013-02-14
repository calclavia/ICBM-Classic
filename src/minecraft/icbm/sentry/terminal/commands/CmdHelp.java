package icbm.sentry.terminal.commands;

import icbm.sentry.gui.GuiConsole;
import icbm.sentry.terminal.CmdHandler;
import icbm.sentry.terminal.ConsoleCommand;
import icbm.sentry.terminal.ISpecialAccess;

import java.util.ArrayList;
import java.util.List;

import net.minecraft.entity.player.EntityPlayer;

public class CmdHelp extends ConsoleCommand
{

	@Override
	public String getCommandPrefix()
	{
		return "help";
	}

	@Override
	public boolean processCommand(EntityPlayer player, ISpecialAccess TE, GuiConsole gui, String[] args)
	{
		if (args.length > 1)
		{
			List<String> displayed = new ArrayList<String>();
			for (ConsoleCommand cc : CmdHandler.cmds)
			{
				if (cc.getCommandPrefix().equalsIgnoreCase(args[1]) && cc.showOnHelp(player, TE) && cc.canMachineUse(TE))
				{
					gui.addToConsole("----------------------");
					gui.addToConsole(args[1] + " commands");
					gui.addToConsole("----------------------");
					List<String> ccList = cc.getCmdUses(player, TE);

					for (String cm : ccList)
					{
						if (!displayed.contains(cm.toLowerCase()))
						{
							gui.addToConsole(cm);
							displayed.add(cm.toLowerCase());
						}
					}
					gui.addToConsole("----------------------");
				}
			}
			return true;
		}
		else
		{
			gui.addToConsole("----------------------");
			gui.addToConsole("Listing commands");
			gui.addToConsole("----------------------");
			gui.addToConsole("help command");
			for (ConsoleCommand cc : CmdHandler.cmds)
			{

				if (cc.showOnHelp(player, TE) && cc.canMachineUse(TE))
				{
					List<String> ccList = cc.getCmdUses(player, TE);
					for (String cm : ccList)
					{
						gui.addToConsole(cm);
					}
				}
			}
			gui.addToConsole("-----------------------");
			return true;
		}
	}

	@Override
	public boolean canPlayerUse(EntityPlayer var1, ISpecialAccess mm)
	{
		return true;
	}

	@Override
	public boolean showOnHelp(EntityPlayer player, ISpecialAccess mm)
	{
		return false;
	}

	@Override
	public List<String> getCmdUses(EntityPlayer player, ISpecialAccess mm)
	{
		return null;
	}

	@Override
	public boolean canMachineUse(ISpecialAccess mm)
	{
		return true;
	}

}
