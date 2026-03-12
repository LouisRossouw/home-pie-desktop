import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { FinanceData, AssetItem } from '@shared/types'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'

interface AssetsSectionProps {
  isAssetsOpen: boolean
  setIsAssetsOpen: (open: boolean) => void
  formData: FinanceData
  totals: {
    assetAllocations: number
    totalAllocations: number
    monthlySavings: number
  }
  addAsset: () => void
  removeAsset: (id: string) => void
  handleAssetChange: (id: string, field: keyof AssetItem, value: string | number) => void
  handleInputChange: (key: keyof FinanceData, value: string | number) => void
}

export function AssetsSection({
  isAssetsOpen,
  setIsAssetsOpen,
  formData,
  totals,
  addAsset,
  removeAsset,
  handleAssetChange,
  handleInputChange
}: AssetsSectionProps) {
  return (
    <Collapsible open={isAssetsOpen} onOpenChange={setIsAssetsOpen}>
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors">
            <div>
              <CardTitle className="flex items-center gap-2">
                Portfolio Assets
                <ChevronDown
                  className={`size-4 transition-transform ${isAssetsOpen ? 'rotate-180' : ''}`}
                />
              </CardTitle>
              <CardDescription>Values, yearly returns, and contributions</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Monthly Total
                </p>
                <p className="text-sm font-bold text-blue-400">
                  R {totals.assetAllocations.toLocaleString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  addAsset()
                }}
                className="h-8 gap-1 border-primary/20 hover:bg-primary/5"
              >
                <Plus className="size-3" /> Add Asset
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-1">
              <div className="grid grid-cols-12 items-center gap-4 px-2 mb-1">
                <Label className="col-span-4 text-[10px] font-black uppercase tracking-widest opacity-50">
                  Asset Label
                </Label>
                <Label className="col-span-3 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">
                  Value
                </Label>
                <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-center text-primary/80">
                  Yield%
                </Label>
                <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-right text-blue-400">
                  Mo. Alloc
                </Label>
                <div className="col-span-1" />
              </div>

              {formData.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="grid grid-cols-12 items-center gap-2 group p-1.5 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10"
                >
                  <div className="col-span-4">
                    <Input
                      value={asset.label}
                      onChange={(e) => handleAssetChange(asset.id, 'label', e.target.value)}
                      className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-semibold"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={asset.value}
                      onChange={(e) => handleAssetChange(asset.id, 'value', e.target.value)}
                      className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-mono text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={asset.growth}
                      onChange={(e) => handleAssetChange(asset.id, 'growth', e.target.value)}
                      className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-mono text-center text-green-400"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={asset.allocation}
                      onChange={(e) => handleAssetChange(asset.id, 'allocation', e.target.value)}
                      className="bg-blue-500/10 border-blue-500/20 h-8 text-right font-bold text-blue-400 text-sm px-2"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeAsset(asset.id)}
                      className="size-7 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {formData.assets.length === 0 && (
                <div className="text-center py-6 text-muted-foreground italic text-sm border-2 border-dashed border-border/20 rounded-xl">
                  No assets added yet.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-border/50 pt-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-black tracking-tighter opacity-70 text-blue-400">
                  Leftover Savings ROI %
                </Label>
                <Input
                  type="number"
                  value={formData.growthRate}
                  onChange={(e) => handleInputChange('growthRate', e.target.value)}
                  className="bg-blue-500/5 h-8 font-bold border-blue-500/20 text-blue-300"
                />
              </div>
            </div>

            <div className="mt-2 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Monthly Allocations:</span>
                <span className="font-bold text-blue-400">
                  R {totals.totalAllocations.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Monthly Savings:</span>
                <span
                  className={`font-bold ${totals.monthlySavings < totals.totalAllocations ? 'text-orange-400' : 'text-green-500'}`}
                >
                  R {totals.monthlySavings.toLocaleString()}
                </span>
              </div>
              {totals.monthlySavings < totals.totalAllocations && (
                <p className="text-[9px] text-orange-400 font-medium brightness-125 pt-1">
                  ⚠️ Total allocations exceed monthly savings. Projections will assume additional
                  funding is available.
                </p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
