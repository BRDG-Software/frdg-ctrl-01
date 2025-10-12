import CaseDisplay from '@/components/CaseDisplay'
import Image from "next/image";


export default function Home() {
  return (
    <div className="m-2">
      <div className="
        p-5
        w-full h-full
        grid grid-rows-10 gap-5
      "
      >
        <div className="
        rounded-[3vw]
        w-full
        row-span-10
        "
        style={{backgroundColor:'#fff'}}
        >
        <div className="grid grid-cols-6 gap-1 w-full h-full
          items-center text-center place-items-center

        ">
          <div className="bg-red-200 "
          ><p>
            spark </p>
          </div> 
          <div className="bg-blue-200"
          >
            <CaseDisplay/>
          </div>
            <div className="inline-block h-[90%] min-h-[1em] w-1 
              self-stretch m-auto"
              style={{backgroundColor:'#4dbdf5'}}
            >
            </div>
          <div className="bg-blue-200"
            >
            case P2L
          </div>
            <div className="inline-block h-[90%] min-h-[1em] w-1 
              self-stretch m-auto"
              style={{backgroundColor:'#4dbdf5'}}
            >
            </div>
          <div className="bg-blue-200"
            >
            case product light
          </div>          
          </div> 
        </div>
        
        <div className="
          rounded-[3vw]
          w-full
          row-span-84
        "
        style={{backgroundColor:'#fff'}}
        >
          
        </div>
      </div>
    </div>
  );
}
