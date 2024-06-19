// components/ColorPicker.tsx
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Circle, CircleCheck } from 'lucide-react';
import React, { useState } from 'react';

interface StyleSetterProps {
  initColor: string,
  initOpacity: number,
  handleColorChange: (color: string) => void
  handleOpacityChange: (opacity: number) => void
}

// 预定义的颜色列表
const colors_row1 = [
  '#ff7002', '#ffc09e', '#ffd100', '#fcf485', '#0000ff', '#38e5ff'
];

const colors_row2 = [
  '#a33086', '#fb88ff', '#e52237', '#ff809d', '#6ad928', '#c5fb72'
];

const colors_row3 = [
  '#000000', '#444444', '#777777', '#aaaaaa', '#cccccc', '#ffffff'
];

const StyleSetter = ({
  initColor,
  initOpacity,
  handleColorChange,
  handleOpacityChange
}: StyleSetterProps) => {
  // 状态来追踪当前选中的颜色
  const [selectedColor, setSelectedColor] = useState<string>(initColor);
  const [opacity, setOpacity] = useState(initOpacity)


  const handleOpacityValueChange = (value: number[]) => {
    setOpacity(value[0]); // 立即更新输入框的值
    handleOpacityChange(value[0])
  };

  return (
    <div className="flex flex-col">
      <div className='flex flex-col items-center justify-center'>
        <div className='flex items-center'>
          {colors_row1.map((color, index) => (
            <div key={index} className="flex items-center justify-center">
              <Button
                key={index}
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedColor(color)
                  handleColorChange(color)
                }}
              >
                {color === selectedColor ? (
                  <CircleCheck style={{ fill: color }} />
                ) : (
                  <Circle style={{ fill: color }} />
                )}
              </Button>
            </div>
          ))}
        </div>
        <div className='flex items-center'>
          {colors_row2.map((color, index) => (
            <div key={index} className="flex items-center justify-center">
              <Button
                key={index}
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedColor(color)
                  handleColorChange(color)
                }}
              >
                {color === selectedColor ? (
                  <CircleCheck style={{ fill: color }} />
                ) : (
                  <Circle style={{ fill: color }} />
                )}
              </Button>
            </div>
          ))}
        </div>
        <div className='flex items-center'>
          {colors_row3.map((color, index) => (
            <div key={index} className="flex items-center justify-center">
              <Button
                key={index}
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedColor(color)
                  handleColorChange(color)
                }}
              >
                {color === selectedColor ? (
                  <CircleCheck style={{ fill: color }} />
                ) : (
                  <Circle style={{ fill: color }} />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className='p-3'>
        <h3 className='text-neutral-500'>Opacity</h3>
        <div className='flex items-center gap-4'>
          <Slider
            className="bg-neutral-500 rounded-lg"
            defaultValue={[opacity]}
            max={100}
            step={1}
            onValueChange={handleOpacityValueChange}
          />
          <span className='text-neutral-500 w-6'>{opacity}</span>
        </div>
      </div>
    </div>
  );
};

export default StyleSetter;
