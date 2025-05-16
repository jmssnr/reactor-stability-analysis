import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const ParameterSlider = (props: {
  min: number;
  max: number;
  label: string;
  value: number;
  parameterkey: string;
  onChange: (v: number[]) => void;
}) => {
  const { min, max, label, value, parameterkey, onChange } = props;
  return (
    <div key={parameterkey} className="flex flex-col gap-2">
      <Label htmlFor={parameterkey}>{label}</Label>
      <div className="flex gap-2 items-center">
        <p className="font-thin text-sm">low</p>
        <Slider
          id={parameterkey}
          value={[value]}
          min={min}
          max={max}
          onValueChange={onChange}
        />
        <p className="font-thin text-sm">high</p>
      </div>
    </div>
  );
};

export default ParameterSlider;
