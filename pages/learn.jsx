import { useState } from "react"

export default function Learn(){
    const [mobile, SetMobile] = useState(false)




   async function runQuery() {
  try {
    console.log("hello");

    const res = await fetch("/api/hello", {
      method: "POST", // ✅ FIXED
    });

    const data = await res.json();
    console.log(data);

  } catch (error) {
    console.error("Error running query:", error);
  }
}
    return(
        <div className="min-h-screen bg-gray-400">
            {/* desktop */}
            <div className="mt-5 hidden sm:flex gap-10 ">
                <div className="ml-5 w-[10%]">
                    <p>logo</p>
                </div>
                
                <div className="flex w-[90%] justify-end pr-5 gap-5">
                    <p>Home</p>
                    <p>About</p>
                    <p>Services</p>
                    <p>Contact</p>
                </div>
            </div>
{/* mobile */}
            <div className="sm:hidden">
<div className="mt-5 flex justify-between ">
                <div className="ml-5 w-[10%]">
                    <p>Logo</p>
                </div>
                <div>
                    <button className="text-xl mr-5"  onClick={()=>{SetMobile(!mobile)}}>{ mobile===false?'≡≡':'X'}</button>
                </div>
                
                
            </div>
            {mobile &&<div className="flex-cols    ml-[88%] gap-5">
                    <p >Home</p>
                    <p>About</p>
                    <p>Services</p>
                    <p>Contact</p>
                </div>}
            </div>
            





            <div className="mt-4 bg-gray-700 p-5">
                <h2 className="text-4xl text-white font-bold">How to learn</h2>

 <button className="bg-red-800 p-3 text-lg rounded-md mt-5 mb-5" onClick={()=>{runQuery()}}>Stay Here</button>


















                <p className="text-gray-200 mt-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia quibusdam sint vitae! Expedita voluptas voluptatibus animi debitis magni tempore eos, ullam optio nulla corrupti dolorem dolores recusandae quis vero, provident repellendus dolore magnam molestiae, dolor aspernatur. Alias eligendi harum magnam sequi hic, odio molestias eaque ullam dolorum! Officiis a minus eveniet soluta vero tempora numquam molestiae provident, quam doloremque odit cupiditate voluptatum vel dignissimos iusto fugit aut aliquid?   distinctio nisi.</p>
    <button className="bg-white p-3 text-lg text-black rounded-md mt-5 hover:bg-gray-300 hover:text-white hover:scale-109 transition-all" >Stay Here</button>
            </div>

            <div className="mt-5 flex gap-5  px-5">
                <div className="h-3 bg-lime-500 basis-[10%] rounded-md">

                </div>
                <div className="h-3 bg-amber-500 basis-[30%] rounded-md">

                </div>
                <div className="h-3 bg-red-500 basis-[60%] rounded-md">

                </div>
            </div>


            <div className=" flex-cols sm:flex px-10 items-strech gap-5 mt-5">
                <div className="w-[100%] sm:w-[50%] border h-[436px] rounded">
                    <img src="https://images.unsplash.com/photo-1773754767059-d645ebf55539?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pics"  className="h-[100%] w-[100%]"/>
                </div>
                <div className="w-[100%] sm:w-[50%] flex flex-col">
                    <div className="bg-gray-300 rounded-md p-5">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>

                    <div className="bg-gray-300 rounded-md p-5 mt-5">  Consequuntur aperiam repellendus iure laborum ratione repellat explicabo vero tempore enim cupiditate eos autem dolore deleniti, quisquam temporibus. Libero voluptatibus eius veritatis facilis. Ex.</div>

                    <div className="bg-gray-300 rounded-md p-5 mt-5">  Tempora, aut perferendis ex dignissimos consequuntur aperiam repellendus iure laborum ratione repellat explicabo vero tempore enim  </div>

                    <div className="bg-gray-300 rounded-md p-5 mt-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores eum veniam alias eius reiciendis    eius veritatis facilis. Ex.</div>

                </div>
            </div>



<div className="px-10 mt-5 grid sm:grid-cols-3 gap-5">
    <div className="w-[100%] border h-[200px] rounded col-span-2 p-5">
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis nam ipsam, impedit totam labore facere modi enim ipsa porro sunt est dolorem reprehenderit, perferendis voluptas illo libero minima! Quod neque quo fugit, ratione expedita accusantium sed, doloribus voluptas eum unde nihil? Qui a earum provident veritatis? Possimus enim repellendus exercitationem.</p>
                    <button className="bg-red-800 p-3 text-lg rounded-md mt-5 mb-5" onClick={()=>{runQuery()}}>Stay Here</button>
                </div>
    <div className="w-[100%] border h-[200px] rounded">
                    <img src="https://images.unsplash.com/photo-1773754767059-d645ebf55539?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pics"  className="h-[100%] w-[100%]"/>
                </div>
    <div className="w-[100%] border h-[200px] rounded">
                    <img src="https://images.unsplash.com/photo-1773754767059-d645ebf55539?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pics"  className="h-[100%] w-[100%]"/>
                </div>
    <div className="w-[100%] border h-[200px] rounded">
                    <img src="https://images.unsplash.com/photo-1773754767059-d645ebf55539?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pics"  className="h-[100%] w-[100%]"/>
                </div>
    <div className="w-[100%] border h-[200px] rounded">
                    <img src="https://images.unsplash.com/photo-1773754767059-d645ebf55539?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pics"  className="h-[100%] w-[100%]"/>
                </div>
    <div className="w-[100%] border h-[200px] rounded">
                    <img src="https://images.unsplash.com/photo-1773754767059-d645ebf55539?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pics"  className="h-[100%] w-[100%]"/>
                </div>
    <div className="w-[100%] border h-[200px] rounded">
                    <img src="https://images.unsplash.com/photo-1773754767059-d645ebf55539?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pics"  className="h-[100%] w-[100%]"/>
                </div>
    <div className="w-[100%] border h-[200px] rounded">
                    <img src="https://images.unsplash.com/photo-1773754767059-d645ebf55539?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pics"  className="h-[100%] w-[100%]"/>
                </div>
</div>

<div className="mt-5 px-5 bg-gray-700 text-gray-200">
    <p className="pt-5 text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe ex officia dolorum, nisi eum culpa atque possimus repudiandae sit odit est nihil nulla cum porro in natus veniam velit aliquid consequuntur corrupti numquam vitae?</p>
    <div className="mt-5 px-5 flex justify-around ">
 <div className="flex-col justify-center  ">
                    <p>Home</p>
                    <p>About</p>
                    <p>Services</p>
                    <p>Contact</p>
                </div>
                 <div className="flex-col  ">
                    <p>Home</p>
                    <p>About</p>
                    <p>Services</p>
                    <p>Contact</p>
                </div>
                 <div className="flex-col  ">
                    <p>Home</p>
                    <p>About</p>
                    <p>Services</p>
                    <p>Contact</p>
                </div>
    </div>
   
    <p className="mt-5 text-center mb-5">@Copy Right 2026</p>
</div>

        </div>

        
    )
}