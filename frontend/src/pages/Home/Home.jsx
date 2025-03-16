
import BoxComponent from "../../component/Box"
import logo from "../../assets/Picture1.png"

export default function Home() {

    return (
      
         <div className=" bg-gray-300 justify-center left-10">
        <BoxComponent
          imageUrl={logo}
          height="700px"
          width="100%"
        />
        </div>
      

    )
  }
  