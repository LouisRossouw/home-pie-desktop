import {
  Select,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectTrigger
} from '~/components/ui/select'

export function GenericSelector({
  selected,
  selectables,
  handleChange
}: {
  selected?: string
  selectables: { label: string; slug: string }[]
  handleChange: (v: string) => void
}) {
  return (
    <Select defaultValue={selected} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a time frame" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectGroup>
          {selectables.map((item) => {
            return (
              <SelectItem key={item.label} value={item.slug}>
                {item.label}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
