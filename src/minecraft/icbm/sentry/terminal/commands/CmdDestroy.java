package icbm.sentry.terminal.commands;

import icbm.sentry.gui.GuiConsole;
import icbm.sentry.platform.TileEntityTurretPlatform;
import icbm.sentry.terminal.AccessLevel;
import icbm.sentry.terminal.ConsoleCommand;
import icbm.sentry.terminal.ISpecialAccess;

import java.util.ArrayList;
import java.util.List;

import net.minecraft.entity.player.EntityPlayer;

public class CmdDestroy extends ConsoleCommand
{

	@Override
	public String getCommandPrefix()
	{
		return "enable";
	}

	@Override
	public boolean processCommand(EntityPlayer player, ISpecialAccess TE, GuiConsole gui, String[] args)
	{
		if (args[0].equalsIgnoreCase("destroy") && args.length > 1 && args[1] != null && TE instanceof TileEntityTurretPlatform)
		{
			TileEntityTurretPlatform turret = (TileEntityTurretPlatform) TE;
			if (args.length > 1)
			{

			}
			else
			{

			}

		}
		return false;
	}

	@Override
	public boolean canPlayerUse(EntityPlayer var1, ISpecialAccess mm)
	{
		return mm.getPlayerAccess(var1).ordinal() >= AccessLevel.OPERATOR.ordinal();
	}

	@Override
	public boolean showOnHelp(EntityPlayer player, ISpecialAccess mm)
	{
		return this.canPlayerUse(player, mm);
	}

	@Override
	public List<String> getCmdUses(EntityPlayer player, ISpecialAccess mm)
	{
		List<String> cmds = new ArrayList<String>();
		cmds.add("destroy");
		cmds.add("destroy code");
		return cmds;
	}

	@Override
	public boolean canMachineUse(ISpecialAccess mm)
	{
		return mm instanceof TileEntityTurretPlatform;
	}

}
