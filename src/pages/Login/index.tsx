import { BackgroundLines } from "@/components/ui/background-lines";
import { WobbleCard } from "@/components/ui/wobble-card";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Github } from "lucide-react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const Login = () => {
  return (
    <div className="">
      <BackgroundLines className="flex w-full justify-center items-center px-4">
        {/* Header section */}
        {/* <div className="flex h-full w-[50%] items-center justify-center">
          <div className="flex flex-col px-16 gap-2">
            <h1 className="text-[50px] font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              RealmRovers
            </h1>
            <p
              style={{ fontWeight: 700 }}
              className="text-xl text-purple-400"
            >
              Build Your World, Invite Friends, and Explore Infinite
              Possibilities
            </p>
          </div>
        </div> */}
        {/* Login Card */}
        <div className="h-full w-[50%] flex items-center justify-center">
          <WobbleCard containerClassName="flex flex-col mx-20">
            <h2 className="max-w-80 text-center text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Sign in and dive into the RealmRovers
            </h2>
            <div className="flex flex-col gap-4 p-8">
              <AwesomeButton type="secondary">
                <div className="flex items-center gap-2">
                  <IconBrandGoogle />
                  <div>Sign in with Google</div>
                </div>
              </AwesomeButton>
              <AwesomeButton type="secondary">
                <div className="flex items-center gap-2">
                  <Github />
                  <div>Sign in with GitHub</div>
                </div>
              </AwesomeButton>
            </div>
          </WobbleCard>
        </div>
      </BackgroundLines>
    </div>
  );
};

export default Login;
