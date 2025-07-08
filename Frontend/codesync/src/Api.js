import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const Api=axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
})

export const giveResult=async (language,value)=>{
const response=await Api.post("/execute",{
    language: language,
    version:LANGUAGE_VERSIONS[language],
    files: [
      {
        content: value,
      },
    ],
  });
  return response.data;
};