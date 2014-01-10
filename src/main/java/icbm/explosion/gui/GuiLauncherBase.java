package icbm.explosion.gui;

import icbm.Reference;
import icbm.explosion.container.ContainerLauncher;
import icbm.explosion.machines.TileEntityLauncherBase;
import net.minecraft.client.gui.inventory.GuiContainer;
import net.minecraft.entity.player.InventoryPlayer;
import net.minecraft.util.ResourceLocation;
import net.minecraft.util.StatCollector;

import org.lwjgl.opengl.GL11;

import cpw.mods.fml.client.FMLClientHandler;

public class GuiLauncherBase extends GuiContainer
{
    public static final ResourceLocation TEXTURE = new ResourceLocation(Reference.DOMAIN, Reference.GUI_PATH + "gui_launcher.png");

    private int containerWidth;
    private int containerHeight;

    private TileEntityLauncherBase tileEntity;

    public GuiLauncherBase(InventoryPlayer par1InventoryPlayer, TileEntityLauncherBase tileEntity)
    {
        super(new ContainerLauncher(par1InventoryPlayer, tileEntity));
        this.tileEntity = tileEntity;
    }

    /** Draw the foreground layer for the GuiContainer (everything in front of the items) */
    @Override
    protected void drawGuiContainerForegroundLayer(int par1, int par2)
    {
        this.fontRenderer.drawString("\u00a77" + tileEntity.getInvName(), 48, 6, 4210752);
        this.fontRenderer.drawString("Place Missile", 63, 28, 4210752);
        this.fontRenderer.drawString(StatCollector.translateToLocal("container.inventory"), 8, this.ySize - 96 + 2, 4210752);
    }

    /** Draw the background layer for the GuiContainer (everything behind the items) */
    @Override
    protected void drawGuiContainerBackgroundLayer(float par1, int par2, int par3)
    {
        FMLClientHandler.instance().getClient().renderEngine.bindTexture(TEXTURE);

        GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);

        containerWidth = (this.width - this.xSize) / 2;
        containerHeight = (this.height - this.ySize) / 2;
        this.drawTexturedModalRect(containerWidth, containerHeight, 0, 0, this.xSize, this.ySize);
    }
}
