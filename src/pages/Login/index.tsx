import { BackgroundLines } from "@/components/ui/background-lines";
import { WobbleCard } from "@/components/ui/wobble-card";
import { IconBrandGoogle } from "@tabler/icons-react";
import axios from "axios";
import { Github } from "lucide-react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const Login = () => {
  const handleGithubLogin = () => {
    const popup = window.open(
      `https://github.com/login/oauth/authorize?client_id=${
        import.meta.env.VITE_CLIENT_ID
      }&redirect_uri=${
        import.meta.env.VITE_CALLBACK_URL
      }&scope=read:user user:email`,
      "github-login",
      "width=600,height=700"
    );

    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { code } = event.data;
      if (code) {
        try {
          const response = await axios.post(
            "http://localhost:8000/github/token",
            { code }
          );

          console.log("resp", response.data);
        } catch (error) {
          console.error("Error during token fetch:", error);
        }
      }

      window.removeEventListener("message", receiveMessage);
      if (popup) popup.close();
    };

    window.addEventListener("message", receiveMessage);
  };
  return (
    <div className="">
      <BackgroundLines className="flex w-full justify-center items-center px-4">
        <div className="h-full lg:w-[50%] md:w-[80%] sm:w-full w-[90%] flex items-center justify-center">
          <WobbleCard containerClassName="flex flex-col mx-20">
            <div className="w-full flex items-center justify-center">
              <h2 className="max-w-80 text-center text-balance text-base md:text-2xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Sign in and dive into the RealmRovers
              </h2>
            </div>

            <div className="flex flex-col gap-4 p-8">
              <AwesomeButton type="secondary">
                <div className="flex items-center gap-2">
                  <IconBrandGoogle />
                  <div>Sign in with Google</div>
                </div>
              </AwesomeButton>
              <AwesomeButton onPress={handleGithubLogin} type="secondary">
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
