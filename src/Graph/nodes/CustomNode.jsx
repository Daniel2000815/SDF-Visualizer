import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { tw } from "twind";
import { useStore } from "../../graphStore";
import {CustomHandle} from "./parts/CustomHandle";
import {Shader} from "../../Shader/Shader";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import {DropdownTS} from "../../Components/Dropdown";
import { defaultMaterial } from "../../Shader/defaultMaterial";
const width = "200px";

const selector = (id) => (store) => ({
  setGain: (e) => store.updateNode(id, { gain: +e.target.value }),
});

export function CustomNode({
  id,
  data,
  children,
  nInputs,
  title,
  dropdownOptions,
  dropdownKeys,
  defaultDropdpwnOption,
  onChangeDropdownOption,
  theme
}) {
  const { setGain } = useStore(selector(id), shallow);
  const [showMore, setShowMore] = React.useState(true);
  useEffect(()=>{
    console.log("WHAT X2 ", dropdownOptions);
  }, [dropdownOptions])
  return (
    <div
      className={tw(`rounded-lg bg-white shadow-xl border-[${theme?.primary}] border`)}
      style={{ width }}
    >
      <p
        className={tw(
          `rounded-t-md px-2 py-1 bg-[${theme?.primary}] text-white text-sm`
        )}
      >
        {title}
      </p>
      {showMore && (
        <div className={`${tw("flex flex-col w-full items-center px-2 space-y-2  pt-1 pb-4")} nodrag`}>
          {dropdownOptions && (
            <DropdownTS
              defaultValue={defaultDropdpwnOption}
              keys={dropdownKeys}
              onChange={onChangeDropdownOption}
              items={dropdownOptions}
              label={title}
              theme={theme}
            />
          )}
            
            {children}
            {/* {data.sdf}       */}
            <Shader sdf={data.sdf} primitives="" width={180} height={100} material={data.material }/>
          
        </div>
      )}

      <button
        className={tw(
          "w-full rounded-b-md px-2 py-1 text-white text-sm flex items-center justify-center",
          `bg-[${theme?.primary}] hover:bg-[${theme?.dark}] active:bg-[${theme?.accent}] focus:outline-none`,
          "transition-colors duration-200"
        )}
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? (
          <FiChevronUp className={tw("w-full")} />
        ) : (
          <FiChevronDown className={tw("w-full")} />
        )}
      </button>

      {/* <Handle className={tw("w-2 h-2")} type="source" position="bottom" /> */}

      {[...Array(nInputs)].map(function (e, i) {
        return (
          <div key={`${id}_targetHandleContainer_${i}`}>
            <CustomHandle
            theme={theme}
              nodeId={id}
              inputNumber={`${i}`}
              type="target"
              // style={{top: `${i/2===0 ? 50 - 10*(i)/2 : 50 + 10*i/2}%`}}
              style={{ top: `${50 - ((nInputs - 1) / 2) * 5 + i * 5}%` }}
            />
          </div>
        );
      })}

      <CustomHandle
      theme={theme}
        nodeId={id}
        inputNumber="0"
        type="source"
        style={{ top: "50%" }}
      />
    </div>
  );
}
