package icbm.explosion.gui;

import icbm.Reference;
import icbm.explosion.ICBMExplosion;
import icbm.explosion.machines.TileEntityLauncherScreen;
import net.minecraft.client.gui.GuiTextField;
import net.minecraft.util.ResourceLocation;

import org.lwjgl.opengl.GL11;

import universalelectricity.api.energy.UnitDisplay;
import universalelectricity.api.vector.Vector3;
import cpw.mods.fml.client.FMLClientHandler;
import cpw.mods.fml.common.network.PacketDispatcher;

public class GuiLauncherScreen extends GuiBase
{
    public static final ResourceLocation TEXTURE = new ResourceLocation(Reference.DOMAIN, Reference.GUI_PATH + "gui_empty.png");

    private TileEntityLauncherScreen tileEntity;
    private GuiTextField tFX;
    private GuiTextField tFY;
    private GuiTextField tFZ;
    private GuiTextField tFFreq;
    private GuiTextField tFGaoDu;

    private int containerWidth;
    private int containerHeight;

    public GuiLauncherScreen(TileEntityLauncherScreen par2ICBMTileEntityMissileLauncher)
    {
        this.tileEntity = par2ICBMTileEntityMissileLauncher;
    }

    /** Adds the buttons (and other controls) to the screen in question. */
    @Override
    public void initGui()
    {
        super.initGui();
        this.tFX = new GuiTextField(fontRenderer, 110, 37, 45, 12);
        this.tFZ = new GuiTextField(fontRenderer, 110, 52, 45, 12);
        this.tFY = new GuiTextField(fontRenderer, 110, 67, 45, 12);
        this.tFGaoDu = new GuiTextField(fontRenderer, 110, 82, 45, 12);
        this.tFFreq = new GuiTextField(fontRenderer, 110, 97, 45, 12);

        this.tFFreq.setMaxStringLength(4);
        this.tFX.setMaxStringLength(6);
        this.tFZ.setMaxStringLength(6);
        this.tFY.setMaxStringLength(3);
        this.tFGaoDu.setMaxStringLength(3);

        this.tFFreq.setText(this.tileEntity.getFrequency() + "");
        this.tFGaoDu.setText(this.tileEntity.gaoDu + "");

        if (this.tileEntity.getTarget() == null)
        {
            this.tFX.setText(Math.round(this.tileEntity.xCoord) + "");
            this.tFZ.setText(Math.round(this.tileEntity.zCoord) + "");
            this.tFY.setText("0");
        }
        else
        {
            this.tFX.setText(Math.round(this.tileEntity.getTarget().x) + "");
            this.tFZ.setText(Math.round(this.tileEntity.getTarget().z) + "");
            this.tFY.setText(Math.round(this.tileEntity.getTarget().y) + "");
        }

        PacketDispatcher.sendPacketToServer(PacketManager.getPacket(ICBMExplosion.CHANNEL, this.tileEntity, -1, true));
    }

    @Override
    public void onGuiClosed()
    {
        super.onGuiClosed();
        PacketDispatcher.sendPacketToServer(PacketManager.getPacket(ICBMExplosion.CHANNEL, this.tileEntity, -1, false));
    }

    /** Call this method from you GuiScreen to process the keys into textbox. */
    @Override
    public void keyTyped(char par1, int par2)
    {
        super.keyTyped(par1, par2);
        this.tFX.textboxKeyTyped(par1, par2);
        this.tFZ.textboxKeyTyped(par1, par2);

        if (tileEntity.getTier() >= 1)
        {
            this.tFY.textboxKeyTyped(par1, par2);
            this.tFGaoDu.textboxKeyTyped(par1, par2);

            if (tileEntity.getTier() > 1)
            {
                this.tFFreq.textboxKeyTyped(par1, par2);
            }
        }

        try
        {
            Vector3 newTarget = new Vector3(Integer.parseInt(this.tFX.getText()), Math.max(Integer.parseInt(this.tFY.getText()), 0), Integer.parseInt(this.tFZ.getText()));

            this.tileEntity.setTarget(newTarget);
            PacketDispatcher.sendPacketToServer(PacketManager.getPacket(ICBMExplosion.CHANNEL, this.tileEntity, 2, this.tileEntity.getTarget().x, this.tileEntity.getTarget().y, this.tileEntity.getTarget().z));
        }
        catch (NumberFormatException e)
        {

        }

        try
        {
            short newFrequency = (short) Math.max(Short.parseShort(this.tFFreq.getText()), 0);

            this.tileEntity.setFrequency(newFrequency);
            PacketDispatcher.sendPacketToServer(PacketManager.getPacket(ICBMExplosion.CHANNEL, this.tileEntity, 1, this.tileEntity.getFrequency()));
        }
        catch (NumberFormatException e)
        {

        }

        try
        {
            short newGaoDu = (short) Math.max(Math.min(Short.parseShort(this.tFGaoDu.getText()), Short.MAX_VALUE), 3);

            this.tileEntity.gaoDu = newGaoDu;
            PacketDispatcher.sendPacketToServer(PacketManager.getPacket(ICBMExplosion.CHANNEL, this.tileEntity, 3, this.tileEntity.gaoDu));
        }
        catch (NumberFormatException e)
        {

        }
    }

    /** Args: x, y, buttonClicked */
    @Override
    public void mouseClicked(int par1, int par2, int par3)
    {
        super.mouseClicked(par1, par2, par3);
        this.tFX.mouseClicked(par1 - containerWidth, par2 - containerHeight, par3);
        this.tFZ.mouseClicked(par1 - containerWidth, par2 - containerHeight, par3);

        if (tileEntity.getTier() >= 1)
        {
            this.tFY.mouseClicked(par1 - containerWidth, par2 - containerHeight, par3);
            this.tFGaoDu.mouseClicked(par1 - containerWidth, par2 - containerHeight, par3);

            if (tileEntity.getTier() > 1)
            {
                this.tFFreq.mouseClicked(par1 - containerWidth, par2 - containerHeight, par3);
            }
        }

    }

    /** Draw the foreground layer for the GuiContainer (everything in front of the items) */
    @Override
    public void drawForegroundLayer(int var2, int var3, float var1)
    {
        this.tFX.drawTextBox();
        this.tFZ.drawTextBox();

        // Draw the air detonation GUI
        if (tileEntity.getTier() >= 1)
        {
            this.tFY.drawTextBox();
            this.fontRenderer.drawString("Detonation Height:", 12, 68, 4210752);

            this.tFGaoDu.drawTextBox();
            this.fontRenderer.drawString("Lock Height:", 12, 83, 4210752);

            if (tileEntity.getTier() > 1)
            {
                this.tFFreq.drawTextBox();
                this.fontRenderer.drawString("Frequency:", 12, 98, 4210752);
            }
        }

        this.fontRenderer.drawString("", 45, 6, 4210752);
        this.fontRenderer.drawString("\u00a77Launcher Control Panel", 30, 6, 4210752);

        this.fontRenderer.drawString("Missile Target", 12, 25, 4210752);
        this.fontRenderer.drawString("X-Coord:", 25, 40, 4210752);
        this.fontRenderer.drawString("Z-Coord:", 25, 55, 4210752);

        int inaccuracy = 30;

        if (this.tileEntity.laucherBase != null)
        {
            if (this.tileEntity.laucherBase.supportFrame != null)
            {
                inaccuracy = this.tileEntity.laucherBase.supportFrame.getInaccuracy();
            }
        }

        this.fontRenderer.drawString("Inaccuracy: " + inaccuracy + " blocks", 12, 113, 4210752);

        // Shows the status of the missile launcher
        this.fontRenderer.drawString("Status: " + this.tileEntity.getStatus(), 12, 125, 4210752);
        this.fontRenderer.drawString("Voltage: " + this.tileEntity.getVoltage() + "v", 12, 137, 4210752);
        this.fontRenderer.drawString(UnitDisplay.getDisplayShort(this.tileEntity.getEnergyStored(), Unit.JOULES) + "/" + UnitDisplay.getDisplayShort(this.tileEntity.getMaxEnergyStored(), Unit.JOULES), 12, 150, 4210752);
    }

    @Override
    protected void drawBackgroundLayer(int var2, int var3, float var1)
    {
        FMLClientHandler.instance().getClient().renderEngine.bindTexture(TEXTURE);
        GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);

        containerWidth = (this.width - this.xSize) / 2;
        containerHeight = (this.height - this.ySize) / 2;
        this.drawTexturedModalRect(containerWidth, containerHeight, 0, 0, this.xSize, this.ySize);
    }

    @Override
    public void updateScreen()
    {
        super.updateScreen();

        if (!this.tFX.isFocused())
            this.tFX.setText(Math.round(this.tileEntity.getTarget().x) + "");
        if (!this.tFZ.isFocused())
            this.tFZ.setText(Math.round(this.tileEntity.getTarget().z) + "");
        if (!this.tFY.isFocused())
            this.tFY.setText(Math.round(this.tileEntity.getTarget().y) + "");

        if (!this.tFGaoDu.isFocused())
            this.tFGaoDu.setText(this.tileEntity.gaoDu + "");

        if (!this.tFFreq.isFocused())
            this.tFFreq.setText(this.tileEntity.getFrequency() + "");
    }
}
