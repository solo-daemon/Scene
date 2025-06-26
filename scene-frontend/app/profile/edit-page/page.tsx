"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { Textarea } from "@/components/ui/textarea";
  import { Button } from '@/components/ui/button'
import { 
    CornerUpLeft, 
    Check, 
    Search, 
    UploadCloud, 
    Cross,  
    RotateCcw as Retry ,
    Instagram,
    Linkedin,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ImageCropper from "@/components/ImageCropper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { use, useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api/base";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { set, setISODay } from "date-fns";
import { JSX, ReactNode, Dispatch, SetStateAction } from 'react';

type AlreadyDataType = {
    identity: {
      id: number,
      identity_name: string
    } | null,
    scene_frequency: {
      id: number,
      scene_frequency_name: string
    } | null,
    who_is_around: {
      id: number,
      who_is_around_name: string
    } | null,
    profile_pic_url: string | null,
    college: {
      id: number,
      college_name: string,
      college_slug: string,
      abbreviation: string,
    } | null,
    about: string | null,
    branch : {
      id: number, 
      branch_name: string,
      branch_slug: string,
    } | null
    yearOfGraduation: number | null,
    travel_type: number | null,
    ten_on_ten : string | null,
    nostalgias: number[] | null,
    instagram_id : string | null,
    linkedin_id: string | null,
}

type ProfileSectionGroup = {
    keys: (keyof AlreadyDataType)[];
    component: React.FC<{
      isComplete: boolean;
      keys: (keyof AlreadyDataType)[];
      values: Partial<AlreadyDataType>;
      setAlreadyData: Dispatch<SetStateAction<AlreadyDataType>>;
    }>;
    id: string;
  };



export default function ProfileEditPage() {
    const [profilePercent, setProfilePercent] = useState(0);
    const profileSections: ProfileSectionGroup[] = [
        { keys: ['identity'], component: Identity, id: 'identity' },
        { keys: ['profile_pic_url'], component: ProfilePic, id: 'profile_pic' },
        { keys: ['college'], component: College, id: 'college' },
        { keys: ['yearOfGraduation'], component: GraduationYear, id: 'graduation' },
        { keys: ['branch'], component: Branch, id: 'branch' },
        { keys: ['about'], component: GoodNightOut, id: 'about' },
        { keys: ['instagram_id', 'linkedin_id'], component: Socials, id: 'socials' }, // 👈 grouped
        { keys: ['nostalgias'], component: Nostalgia, id: 'nostalgias' },
        { keys: ['travel_type'], component: PlanRole, id: 'travel' },
        { keys: ['ten_on_ten'], component: NeverNo, id: 'never_no' },
        { keys: ['who_is_around'], component: WhoIsAround, id: 'who_is_around' },
        { keys: ['scene_frequency'], component: SceneFrequency, id: 'scene_frequency' },
      ];

    const [alreadyData, setAlreadyData] = useState<AlreadyDataType>({
        identity: null,
        scene_frequency: null,
        who_is_around: null,
        profile_pic_url: null,
        college: null,
        about: null,
        branch: null,
        yearOfGraduation: null,
        travel_type: null,
        ten_on_ten: null,
        nostalgias: null,
        instagram_id: null,
        linkedin_id: null,
    })

    const isGroupComplete = (keys: (keyof AlreadyDataType)[]): boolean => {
        return keys.every((key: keyof AlreadyDataType) => {
          const value = alreadyData[key];
      
          if (Array.isArray(value)) return value.length > 0;
          if (value === null || value === undefined) return false;
          if (typeof value === "string") return value.trim().length > 0;
          if (typeof value === "number") return true;
          if (typeof value === "object") return Object.keys(value).length > 0;
      
          return false;
        });
      };

    useEffect(()=>{
        apiGet.get("/user/questions/")
        .then((res:any)=>{
        setAlreadyData(res.data)
        })
        .catch((e:any)=>{
        toast.error("server is not respoding")
        })
    },[])

    useEffect(() => {
        const fields = Object.keys(alreadyData) as (keyof AlreadyDataType)[];
        const total = fields.length;
      
        let filled = 0;
      
        fields.forEach((key) => {
          const value = alreadyData[key];
      
          if (Array.isArray(value)) {
            if (value.length > 0) filled++;
          } else if (value !== null && value !== undefined) {
            if (typeof value === 'string' && value.trim() !== '') filled++;
            else if (typeof value === 'number') filled++;
            else if (typeof value === 'object' && Object.keys(value).length > 0) filled++;
          }
        });
      
        const percent = Math.round((filled / total) * 100);
        setProfilePercent(percent);
      }, [alreadyData]);

    const [checkBlack, setCheckBlack] = useState(false);
    return(
        <div className="p-4 py-6 font-[Graphik Trial]">
            <div className="flex">
                <div className="p-2 rounded-full border-[#EDEDED] border-2"
                onClick={()=>{window.history.back()}}
                >
                    <CornerUpLeft />
                </div>
            </div>
            <div className="flex items-center my-6">
                <div
                className="mr-4 text-2xl font-bold"
                >{profilePercent} %</div>
                <Progress
                value={profilePercent}
                className="w-[70%] h-4 self-center mt-2"
                indicatorColor="bg-[#39F26D]
                [background-image:linear-gradient(135deg,rgba(255,255,255,.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.35)_50%,rgba(255,255,255,.35)_75%,transparent_75%,transparent)] bg-[length:20px_20px]
                
                " />
            </div>
            <div className="my-4">
                <h1 className="font-bold text-2xl">{!checkBlack ? "complete your profile":"your profile"}</h1>
            </div>
            <div className="pt-2 text-base">
            <Tabs defaultValue={"incomplete"} className="w-full" onValueChange={()=>{setCheckBlack(!checkBlack)}}>
                        <TabsList className="bg-[#ffffff] border-0 w-full p-0 font-medium">
                            <div className="w-full flex justify-center border-2 border-[#FAFAFA] rounded-xl py-1">
                            <TabsTrigger value="incomplete"
                                className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] mx-1 py-2"
                            >
                                incomplete
                            </TabsTrigger>
                            <TabsTrigger value="complete"
                                className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] mx-1 py-2"
                            >
                                <span>
                                    complete
                                    </span>
                                <span className="ml-1 p-1 bg-[#4BC761] rounded-full">
                                    <Check color={checkBlack? "#000000":"#ffffff"} size={1}/>
                                </span>
                            </TabsTrigger>
                            </div>
                        </TabsList>
                        <TabsContent value="incomplete">
                            <div className="my-4 flex flex-col gap-4 w-full mb-[200px]">
                            {profileSections.map(({ keys, component: Component, id }) => {
                                const isComplete = isGroupComplete(keys);

                                const values: Partial<AlreadyDataType> = {};

                                keys.forEach((key) => {
                                  values[key] = alreadyData[key] as any; // or use type assertion below
                                });

                                if(isComplete) return;
                                return (
                                    <Component
                                    key={id}
                                    isComplete={isComplete}
                                    values={values}
                                    keys={keys}
                                    setAlreadyData={setAlreadyData}
                                    />
                                );
                                })}
                            </div>
                        </TabsContent>

                        <TabsContent value="complete">
                            <div className="my-4 flex flex-col gap-4 w-full mb-[200px]">
                            {profileSections.map(({ keys, component: Component, id }) => {
                                const isComplete = isGroupComplete(keys);
                                const values: Partial<AlreadyDataType> = {};

                                keys.forEach((key) => {
                                  values[key] = alreadyData[key] as any; // or use type assertion below
                                });

                                if(!isComplete) return;
                                return (
                                    <Component
                                    key={id}
                                    isComplete={isComplete}
                                    values={values}
                                    keys={keys}
                                    setAlreadyData={setAlreadyData}
                                    />
                                );
                                })}
                            </div>
                        </TabsContent>
                       
                    </Tabs>
            </div>
        </div>
    );

}

interface IdentityOptions{
    id: number,
    identity_name: string,
}

function Identity(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [identityOptions, setIdentityOptions] = useState<IdentityOptions[]>([])
    const [selectedIdentity, setSelectedIdentity] = useState<number | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    useEffect(()=>{
        if(props.values.identity){
            setSelectedIdentity(props.values.identity.id)
        }
    },[])

    const toggleIdentity = (id: number, index:number) => {
        setSelectedIdentity(id)
        setSelectedIndex(index)
        setIsAnOptionSelected(true)
      }

      const handleSave = () => {
        if (selectedIdentity !== null) {
            apiPost.post("/identities/", {
                identity_id: selectedIdentity,
            })
            .then((res:any)=>{
                toast.success("updated")
                props.setAlreadyData((prev:any)=>{
                return {...prev, identity: identityOptions[selectedIndex || 0]}
                });
                setIsAnOptionSelected(false)
            })
            .catch((e:any)=>{
                toast.error("request failed, please try again")
            })
        }
      }

    useEffect(()=>{
        apiGet.get("/identities/")
        .then((res:any)=>{
            setIdentityOptions(res.data)
        })
        .catch((e:any)=>{
            toast.error("not able to fetch identities please refresh")
        })
    }, [])
    return(
        <Accordion type="single" collapsible className={" w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl">
          <AccordionTrigger className="text-left text-black text-sm font-medium] items-center">
          <div className="flex items-center flex-wrap">
                how do you identify ?
                {props.isComplete && <span className="ml-2 p-1 bg-[#4BC761] rounded-full">
                    <Check color="#ffffff" className="w-2 h-2"/>
                    </span>}
                </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
          <div className="space-y-4">
          {identityOptions.map((identity: IdentityOptions, index:number) => (
            <div
              key={`${identity.id}`}
              className="flex items-center space-x-3 rounded-xl px-4 py-3 cursor-pointer bg-[#ffffff]"
              onClick={() => toggleIdentity(identity.id, index)}
            >
              <Checkbox
                id={`${identity.id}`}
                checked={selectedIdentity === identity.id}  
                onCheckedChange={() => toggleIdentity(identity.id, index)}
                className="border-muted-foreground/30 data-[state=checked]:bg-[#4BC761] data-[state=checked]:border-[#4BC761] data-[state=checked]:text-white"
              />
              <Label htmlFor={`${identity.id}`} className="text-sm font-normal cursor-pointer">
                {identity.identity_name}
              </Label>
            </div>
          ))}
        </div>
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={handleSave}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
}

function ProfilePic(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<number | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number |null>(null);
    useEffect(()=>{
        if(props.values.profile_pic_url){
            setPreviewUrl(props.values.profile_pic_url)
        }
    },[])
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
    
        if (!file) return;
    
        // ✅ Validate file type (Only images)
        if (!file.type.startsWith("image/")) {
          setUploadStatus(1);
          return;
        }
    
        // ✅ Check for malware (Example: Checking file size as a basic validation)
        if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
          setUploadStatus(2);
          return;
        }
    
        setSelectedFile(file);
        setIsAnOptionSelected(true)
        setPreviewUrl(URL.createObjectURL(file));
        setUploadStatus(6)
    
      };
    
      const handleCrop=(file:any)=>{
        const fileURL = (URL.createObjectURL(file))
        setPreviewUrl(fileURL)
        const formData = new FormData();
        formData.set("profile_pic", file, "profile_pic.jpg");
        apiPost.post("/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ Important
          },
          onUploadProgress: (progressEvent: any) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent)
          },
          timeout: 20000,
        })
        .then((res:any)=>{
          setUploadStatus(3)
          props.setAlreadyData((prev:any)=>{
            return {...prev, profile_pic_url:fileURL}
          })
          setIsAnOptionSelected(true)
          toast.success("updated profile pic")
        })
        .catch((e:any)=>{
          setUploadStatus(4)
        })
      }
    
      const handleRetry = () =>{
        if(selectedFile){
          const formData = new FormData();
          formData.append("profile_pic", selectedFile)
          apiPost.post("/upload/", formData, {
            headers: {
              "Content-Type": "multipart/form-data", // ✅ Important
            },
            onUploadProgress: (progressEvent: any) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            },
            timeout: 20000,
          })
          .then((res:any)=>{
            setUploadStatus(3)
            props.setAlreadyData((prev:any)=>{
                return {...prev, profile_pic_url:previewUrl}
              })
          })
          .catch((e:any)=>{
            setUploadStatus(4)
          })
        }else{
          toast.error("please select a file")
        }
      }

    return(
        <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
          <AccordionTrigger className="text-left text-black text-sm font-medium] items-center">
          <div className="flex items-center flex-wrap">
                face for your profile
                {props.isComplete && <span className="ml-2 p-1 bg-[#4BC761] rounded-full">
                    <Check color="#ffffff" className="w-2 h-2"/>
                    </span>}
                </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
          <div className={`flex flex-col items-center space-y-4 rounded-lg ${previewUrl ? "p-0": "p-4 border"}`}>
        <label className={`w-full flex items-center cursor-pointer ${previewUrl ? "border-0":"border-dashed border-2 h-32 justify-center"}`}>
          <input type="file" className="hidden" onChange={handleFileChange} />
          <div className="text-gray-500 w-full">
            {previewUrl ? (
              <ImageCropper previewUrl={previewUrl || ""}  handleCrop={handleCrop} uploadStatus={uploadStatus || -1}/>
            ) : (
              <>
               <div className="text-gray-500 flex items-center justify-center w-full">
                <UploadCloud className="h-6 w-6" />
                <span>no id card pics allowed</span>
              </div>
              </>
            )}
          </div>
        </label>
    </div>
    {uploadStatus && (
          <div className="text-sm flex items-center space-x-2 mt-6 font-semibold">
            {(uploadStatus === 3 || uploadStatus===5) && <div className="p-1 bg-[#4BC761] rounded-full">
              <Check className="h-4 w-4" color="#ffffff"/>
            </div>
            }
            {(uploadStatus === 1 || uploadStatus === 2 || uploadStatus === 4) && <div className="p-1 bg-[#EC0C0C] rounded-full">
              <Cross className="h-4 w-4" color="#ffffff"/>
            </div>
            }
            <span>
              {uploadStatus===1 && "only image files are allowed"}
              {uploadStatus === 2 && "file too large. max 5MB."}
              {uploadStatus === 3 && "uploaded successfully"}
              {uploadStatus === 4 && 
                <div className="flex items-center">
                  <div>can't upload, please retry</div>
                  <div className="ml-4">
                      <div className="w-4 h-4"
                        onClick={handleRetry}
                      ><Retry /></div>
                  </div>
                </div>
              }
              {uploadStatus===5 && "already uploaded — but feel free to switch it up if you’ve got a new look!"}
            </span>
          </div>
        )}
        {(uploadProgress && uploadStatus !== 6) && 
        <Progress
        value={uploadProgress}
        className="w-[65%] h-2 self-center mt-2"
        indicatorColor="bg-[#39F26D]
        [background-image:linear-gradient(135deg,rgba(255,255,255,.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.35)_50%,rgba(255,255,255,.35)_75%,transparent_75%,transparent)] bg-[length:20px_20px]
        
        " />
        }
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
}

interface CollegeOptions{
    id: number,
    college_name: string,
    college_slug: string,
}

function College(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [collegeOptions, setCollegeOptions] = useState<CollegeOptions[]>([])
    const [selectedCollege, setSelectedCollege] = useState<CollegeOptions | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredColleges, setFilteredColleges] = useState<CollegeOptions[]>([])
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false);

    useEffect(()=>{
        if(props.values.college){
            setSelectedCollege(props.values.college)
            setSearchTerm(props.values.college.college_name)
        }
    },[])

    useEffect(()=>{
        apiGet.get("/colleges/")
        .then((res:any)=>{
            setCollegeOptions(res.data)
        })
        .catch((e:any)=>{
            toast.error("not able to fetch colleges, please reload")
        })
    },[])
    useEffect(() => {
        if (searchTerm && searchTerm != (props.values?.college?.college_name || "")) {
          setFilteredColleges(
            collegeOptions.filter((college: CollegeOptions) =>
              college.college_name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        } else {
          setFilteredColleges([])
        }
      }, [searchTerm, collegeOptions])

    const handleSelectCollege = (college: CollegeOptions, index:number) => {
        setFilteredColleges([])
        setSelectedCollege(college)
        setIsAnOptionSelected(true)
        setSearchTerm(college.college_name)
    }

    const handleSave = () =>{
        if(selectedCollege){
            apiPost.post("/colleges/", {
                college_id: selectedCollege.id,
            })
            .then((res:any)=>{
                toast.success(`updated college`)
                setIsAnOptionSelected(false)
                props.setAlreadyData((prev:any)=>{
                    return {...prev, college: selectedCollege}
                  })
            })
            .catch((e:any)=>{
                toast.error("request failed, please try again")
            })
        }
    }
    return(
        <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
          <AccordionTrigger className="text-left text-black text-sm font-medium] items-center">
          <div className="flex items-center flex-wrap">
                your college?
                {props.isComplete && <span className="ml-2 p-1 bg-[#4BC761] rounded-full">
                    <Check color="#ffffff" className="w-2 h-2"/>
                    </span>}
                </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
          
        <div className="flex items-center border-0 p-1 bg-[#ffffff] rounded-lg">
        <div className="mr-2 ml-2">
          <Search color="#818181" size={20}/>
        </div>
          <input
            type="text"
            placeholder="where your parents sent you to study"
            className="text-xs w-full py-3 px-2 rounded-lg outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => setTimeout(() => setFilteredColleges([]), 50)}
          />
        </div>
        {/* Dropdown List */}
        <div className="relative h-20 overflow-y-auto">
        {filteredColleges.length > 0 && (
            <ul className="absolute w-full bg-white border rounded-lg overflow-y-auto">
              {filteredColleges.map((college:CollegeOptions, index:number) => (
                <li
                  key={college.id}
                  onClick={() => handleSelectCollege(college, index)}
                  className="p-2 hover:bg-gray-200 cursor-pointer max-h-100"
                >
                  {college.college_name}
                </li>
              ))}
            </ul>
          )}
        </div>
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={handleSave}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
}

function GraduationYear(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [year, setYear] = useState<number>(2025)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(!props.isComplete)

    const handleSave = () =>{
        apiPost.post('/user/year_update/',{
            year
        })
        .then((res:any)=>{
            toast.success(`updated year`)
            setIsAnOptionSelected(false)
            props.setAlreadyData((prev:any)=>{
                return {...prev, yearOfGraduation: year}
            })
        })
        .catch((e:any)=>{
            toast.error("please try again")
        })
    }
    useEffect(()=>{
        setYear(props.values?.yearOfGraduation || 2025)
    },[])
    return(
        <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
          <AccordionTrigger className="text-left text-black text-sm font-medium] items-center">
          <div className="flex items-center flex-wrap">
                graduation year ?
                {props.isComplete && <span className="ml-2 p-1 bg-[#4BC761] rounded-full">
                    <Check color="#ffffff" className="w-2 h-2"/>
                    </span>}
                </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
          <div className="space-y-4">
                  <div className="relative">
                  <Input
                      className="text-sm p-4 bg-[#ffffff] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                      placeholder="for the fire reels"
                      value={year}
                      type="number"
                      onChange={(e) => {
                        // Remove leading zeros using regex
                        const inputValue = e.target.value.replace(/^0+/, '');
                        const value = Number(inputValue);
                        setYear(value);
                      
                        if (!isNaN(value) && value >= 1900 && value <= 2030) {
                          setIsAnOptionSelected(true);
                        } else {
                          setIsAnOptionSelected(false);
                        }
                      }}
                    />
                  </div>
                </div>
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={handleSave}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
}

interface BranchOptions{
    id: number,
    branch_name: string,
}

function Branch(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [branchOptions, setBranchOption] = useState<BranchOptions[]>([])
    const [selectedBranch, setSelectedBranch] = useState<BranchOptions | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredBranches, setFilteredBranches] = useState<BranchOptions[]>([])
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    useEffect(()=>{
        apiGet.get('/branches/')
        .then((res:any)=>{
            setBranchOption(res.data)
        })
        .catch((e:any)=>{
            toast.error("not able to fetch branches, please refresh")
        })
        if(props.values?.branch){
            setSelectedBranch(props.values?.branch)
            setSearchTerm(props.values?.branch.branch_name.toLowerCase())
        }
    },[])

    useEffect(() => {
        if (searchTerm && searchTerm !== (props.values?.branch?.branch_name.toLowerCase() || "")) {
          setFilteredBranches(
            branchOptions.filter((branch: BranchOptions) =>
              branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        } else {
          setFilteredBranches([])
        }
      }, [searchTerm, branchOptions])

    const handleSelectBranch = (branch: BranchOptions) => {
       
            setSelectedBranch(branch)
            setSearchTerm(branch.branch_name.toLowerCase()) // Show selected college in input box
            setIsAnOptionSelected(true)
            setFilteredBranches([]) // Hide dropdown
      }

      const handleSave = () =>{
        apiPost.post('/branches/',{
            branch_id: selectedBranch?.id
        })
        .then((res:any)=>{
            toast.success(`update branch`)
            props.setAlreadyData((prev:any)=>{
                return {...prev, branch: selectedBranch}
            })
        })
        .catch((e:any)=>{
            toast.error("please try again")
        })
      }
    return(
        <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
          <AccordionTrigger className="text-left text-black text-sm font-medium] items-center">
          <div className="flex items-center flex-wrap">
                & branch ?
                {props.isComplete && <span className="ml-2 p-1 bg-[#4BC761] rounded-full">
                    <Check color="#ffffff" className="w-2 h-2"/>
                    </span>
                }
                </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
          <div className="flex items-center border-0 p-1 bg-[#ffffff] rounded-lg">
        <div className="mr-2 ml-2">
          <Search color="#818181" size={20}/>
        </div>
          <input
            type="text"
            placeholder="don't be shy , civil ain't bad :)"
            className="text-xs w-full py-3 px-2 rounded-lg outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => setTimeout(() => setFilteredBranches([]), 50)}
          />
        </div>
        <div className="relative h-20 overflow-y-auto">
          {/* Dropdown List */}
          {filteredBranches.length > 0 && (
            <ul className="absolute w-full bg-white border rounded-lg mt-1 max-h-20 overflow-auto">
              {filteredBranches.map((branch) => (
                <li
                  key={branch.id}
                  onClick={() => handleSelectBranch(branch)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {branch.branch_name.toLowerCase()}
                </li>
              ))}
            </ul>
          )}
        </div>
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={handleSave}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
}

function GoodNightOut(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [value, setValue] = useState("");
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    
    useEffect(()=>{
        if(props.values.about){
            setValue(props.values.about)
        }
    },[])

    useEffect(()=>{
        if(props.values.about !== value){
            setIsAnOptionSelected(true)
        }
    },[value])
    const handleSave = () =>{
        apiPost.post('/user/about/',{
            about: value
        })
        .then((res:any)=>{
            toast.success(`updated about`)
            props.setAlreadyData((prev:any)=>{
                return {...prev, about: value}
            })
        })
        .catch((e:any)=>{
            toast.error("please try again")
        })
    }


    return (
      <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
        <AccordionTrigger className="text-left text-black text-sm font-medium items-center">
        <div className="inline-flex items-center">
            what's your idea of a good night out ?
            {props.isComplete && (
                <Check className="w-4 h-4 ml-1 inline-block align-middle bg-[#4BC761] rounded-full p-1" color="#ffffff" />
            )}
            </div>
            </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-sm min-h-[100px] bg-[#ffffff] text-[#000000] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
              placeholder="sunset, food, someonecute (you?)"
            />
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={()=>{handleSave()}}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  function Socials(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [instagramId, setInstagramId] = useState("");
    const [linkedinId, setLinkedinId] = useState("");
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    useEffect(()=>{
        if(props.values.instagram_id){
            setInstagramId(props.values.instagram_id)
        }
        if(props.values.linkedin_id){
            setLinkedinId(props.values.linkedin_id)
        }
    },[props.values.instagram_id, props.values.linkedin_id])
    useEffect(()=>{
        if(props.values.instagram_id !== instagramId || props.values.linkedin_id !== linkedinId){
            setIsAnOptionSelected(true)
        }
    },[instagramId, linkedinId])
    const handleSave = () =>{
        if((props.values.instagram_id || props.values.linkedin_id) && (!instagramId || !linkedinId)){
            setIsAnOptionSelected(false)
            return;
        }
        apiPost.post('/user/socials/', {
            instagram: instagramId || "",
            linkedin: linkedinId || "",

        })
        .then((res:any)=>{
            props.setAlreadyData((prev:any)=>{
                return{...prev, instagram_id: instagramId, linkedin_id: linkedinId}
            })
            toast.success('updated successfully')
        })
        .catch((e:any)=>{
            toast.error("please try again!")
        })
    }
    return (
      <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
        <AccordionTrigger className="text-left text-black text-sm font-medium items-center">
        <div className="inline-flex items-center">
            add socials
            {props.isComplete && (
                <Check className="w-4 h-4 ml-2 inline-block align-middle bg-[#4BC761] rounded-full p-1" color="#ffffff" />
            )}
            </div>
            </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
          <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <Input
                    className="py-6 text-sm pl-10 bg-[#ffffff] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    placeholder="for the fire reels"
                    value={instagramId}
                    onChange={(e) => setInstagramId(e.target.value)}
                  />
                </div>
        
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <Input
                    className="py-6 text-sm pl-10 bg-[#ffffff] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    placeholder="for the ones balancing work"
                    value={linkedinId}
                    onChange={(e) => setLinkedinId(e.target.value)}
                  />
                </div>
              </div>
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={()=>{handleSave()}}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

interface NostalgiaOptions {
    id: number,
    nostalgia_name: string,
}

function Nostalgia(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [nostalgias, setNostalgias] = useState<NostalgiaOptions[]>([])
    const [nostalgiaIds, setNostalgiaIds] = useState<number[]>([]);
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)

    const handleSave = () => {
        apiPost.post('/user/set-nostalgias/', {
            nostalgia_ids: nostalgiaIds
        })
        .then((res:any)=>{
            setIsAnOptionSelected(false)
            toast.success("saved")
            props.setAlreadyData((prev: any) => {
                return {...prev, nostalgias: nostalgiaIds}
            })
        })
        .catch((e:any)=>{
            toast.error("please try again")
        })
    }

    useEffect(()=>{
        setNostalgiaIds(props.values?.nostalgias || [])
    },[])
    useEffect(()=>{
        apiGet.get("/nostalgias")
        .then((res:any)=>{
          setNostalgias(res.data)
        })
        .catch((e:any)=>{
          toast.error("can't fetch please reload")
        })
      },[])
      useEffect(()=>{

        if(nostalgiaIds.length >0 && nostalgiaIds !== props.values?.nostalgias){
          setIsAnOptionSelected(true)
        }else{
          setIsAnOptionSelected(false)
        }
      },[nostalgiaIds])
      const handleSelect = (id: number) => {
        if (nostalgiaIds.includes(id)) {
            // _id is a different name for id local and global scope issue
          setNostalgiaIds(prev =>{
            return prev.filter((_id: number) => _id !== id)
          });
        } else {
          if (nostalgiaIds.length < 5) {
            // Add the index
            setNostalgiaIds(prev => [...prev, id]);
          } else {
            // Show warning if trying to add more than 5
            toast.warning("Please select only up to 5 options");
          }
        }
      };
    return(
        <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
          <AccordionTrigger className="text-left text-black text-sm font-medium] items-center">
          <div className="flex items-center flex-wrap">
                what give you instant nostalgia?
                {props.isComplete && <span className="ml-2 p-1 bg-[#4BC761] rounded-full">
                    <Check color="#ffffff" className="w-2 h-2"/>
                    </span>}
                </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
          <div className="flex flex-wrap gap-4">
          {
          nostalgias.map((nostalgia:NostalgiaOptions, index:number)=>{
            if (nostalgiaIds.includes(nostalgia.id)){
              return(
                    <div
                        key={index}
                        className={"py-2 px-4 border-1 rounded-lg " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5] text-[#4BC761]":"border-[#4E55E1] bg-[#F1F1FD] text-[#4E55E1]")}
                        onClick={()=>{handleSelect(nostalgia.id)}}>
                        {nostalgia.nostalgia_name}
                    </div>
              );
            }
            return(
              <div
                key={index}
                  className="py-2 px-4 border-1 border-[#E2E2E2] 
                  bg-[#ffffff] rounded-lg"
                  onClick={()=>{handleSelect(nostalgia.id)}}
                  >
                  {nostalgia.nostalgia_name}
          </div>
            );
          })
        }
        </div>
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={()=>{handleSave()}}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
}

interface PlanRoleOptions {
    id: number,
    travel_type: string,
    description: string,
}

function PlanRole(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [planRoleOptions, setPlanRoleOptions] = useState<PlanRoleOptions[]>([])
    const [selectedRole, setSelectedRole] = useState<number | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    useEffect(()=>{
        apiGet.get('/travel-types')
        .then((res:any)=>{
          setPlanRoleOptions(res.data)
        })
        .catch((e:any)=>{
          toast.error("can't fetch plan roles, please reload")
        })
    }, [])

    useEffect(()=>{
        if(props.values?.travel_type){
            setSelectedRole(props.values?.travel_type)
        }
    },[props.values])

    const handleSave = () =>{
        apiPost.post('/travel-types/',{
            travel_type_id: selectedRole,
        })
        .then((res:any)=>{
            setIsAnOptionSelected(false)
            toast.success("saved")
            props.setAlreadyData((prev: any) => {
                return {...prev, travel_type: selectedRole}
            })
        })
        .catch((e:any)=>{
            toast.error("please try again")
        })
    }

    const handleSelect = (plan: PlanRoleOptions)=>{
      setSelectedRole(plan.id)
      setIsAnOptionSelected(true)
    }

    return(
        <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
          <AccordionTrigger className="text-left text-black text-sm font-medium] items-center">
          <div className="inline-flex items-center">
            who are you when plans are happening ?
            {props.isComplete && (
                <Check className="w-4 h-4 ml-1 inline-block align-middle bg-[#4BC761] rounded-full p-1" color="#ffffff" />
            )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
            <div className="space-y-2">
                {planRoleOptions.map((plan: PlanRoleOptions, index: number) => (
                    <div
                    key={plan.id}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                        selectedRole === plan.id ? (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5] text-[#4BC761]":"border-[#4E55E1] bg-[#F1F1FD] text-[#4E55E1]") : "bg-[#ffffff] border-2 border-[#E2E2E2]"
                    }`}
                    onClick={() => handleSelect(plan)}
                    >
                    <h2 className="text-sm font-bold">{plan.travel_type}</h2>
                    <p className="text-xs opacity-80">{plan.description}</p>
                    </div>
                    
                ))}
            </div>
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={()=>{handleSave()}}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
}

function NeverNo(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [value, setValue] = useState("")
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    const handleSave=()=>{
        apiPost.post('/user/ten-on-ten/',{
            ten_on_ten: value,
        })
        .then((res:any)=>{
            setIsAnOptionSelected(false)
            toast.success("saved")
            props.setAlreadyData((prev:any)=>{
                return {...prev, ten_on_ten: value}
            })
        })
        .catch((e:any)=>{
            toast.error("please try again!")
        })
    }
    useEffect(()=>{
        if(props.values.ten_on_ten){
            setValue(props.values.ten_on_ten)
        }
    },[props.values.ten_on_ten])
    useEffect(()=>{
        if(value.length > 0 && value !== props.values.ten_on_ten) setIsAnOptionSelected(true)
    },[value])
    return(
        <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
          <AccordionTrigger className="text-left text-black text-sm font-medium] items-center">
          <div className="flex items-center flex-wrap">
                i never say no to?
                {props.isComplete && <span className="ml-2 p-1 bg-[#4BC761] rounded-full">
                    <Check color="#ffffff" className="w-2 h-2"/>
                    </span>}
                </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden">
          <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-sm min-h-[100px] bg-[#ffffff] text-[#000000] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
              placeholder="sunset, food, someonecute (you?)"
            />
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={()=>{handleSave()}}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
}

interface WhoIsAroundOptions{
    id: number,
    who_is_around_name: string
}

function WhoIsAround(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [whoIsAroundOptions, setWhoIsAroundOptions] = useState<WhoIsAroundOptions[]>([])
    const [selectedOption, setSelectedOption] = useState<WhoIsAroundOptions | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    useEffect(()=>{
        apiGet.get('/who-is-around')
        .then((res:any)=>{
            setWhoIsAroundOptions(res.data)
        })
        .catch((e:any)=>{
            toast.error("can't fetch options, please reload")
        })
    },[])
    const toggleIdentity = (option: WhoIsAroundOptions, index:number) => {
        setSelectedOption(option)
        setIsAnOptionSelected(true)
      }
    useEffect(()=>{
        if(props.values.who_is_around){
            setSelectedOption(props.values.who_is_around)
        }
    },[props.values.who_is_around])
    const handleSave = () =>{
        apiPost.post('/who-is-around/',{
            who_is_around_id: selectedOption?.id
        })
        .then((res:any)=>{
            setIsAnOptionSelected(false)
            toast.success("saved")
            props.setAlreadyData((prev:any)=>{
                return {...prev, who_is_around: selectedOption}
            })
        })
        .catch((e:any)=>{
            toast.error("please try again!")
        })
    }
    return(
        <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
          <AccordionTrigger className="text-left text-black text-sm font-medium] items-center">
          <div className="flex items-center flex-wrap">
                when you are out who is around?
                {props.isComplete && <span className="ml-2 p-1 bg-[#4BC761] rounded-full">
                    <Check color="#ffffff" className="w-2 h-2"/>
                    </span>}
                </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden text-sm">
          <div className="space-y-4">
          {whoIsAroundOptions.map((option: WhoIsAroundOptions, index:number) => (
            <div
              key={`${option.id}`}
              className="flex items-center space-x-3 rounded-lg px-4 py-3 cursor-pointer bg-[#ffffff]"
              onClick={() => toggleIdentity(option, index)}
            >
              <Checkbox
                id={`${option.id}`}
                checked={selectedOption?.id === option.id}  
                onCheckedChange={() => toggleIdentity(option, index)}
                className="border-muted-foreground/30 data-[state=checked]:bg-[#4BC761] data-[state=checked]:border-[#4BC761] data-[state=checked]:text-white"
              />
              <Label htmlFor={`${option.id}`} className="text-sm font-normal cursor-pointer">
                {option.who_is_around_name}
              </Label>
            </div>
          ))}
        </div>
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={()=>{handleSave()}}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
}

interface SceneFreuencyOptions{
    id: number,
    scene_frequency_name: string
}

function SceneFrequency(props: 
    {isComplete: boolean
    keys: string[]
    values: Partial<AlreadyDataType>
    setAlreadyData: any
    }) {
    const [sceneFrequencyOptions, setSceneFrequencyOptions] = useState<SceneFreuencyOptions[]>([])
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    useEffect(()=>{
        if(props.values.scene_frequency){
            setSelectedOption(props.values.scene_frequency.id)
        }
    },[props.values.scene_frequency])
    const toggleIdentity = (id: number, index:number) => {
        setSelectedOption(id)
        setIsAnOptionSelected(true)
        // props.setAlreadyData((prev:any)=>{
        //   return{...prev, scene_frequency: sceneFrequencyOptions[index]}
        // })
        setSelectedIndex(index)
      }
      const handleSave = () =>{
        apiPost.post('/scene-frequency/',{
          scene_frequency_id: selectedOption
      })
      .then((res:any)=>{
        toast.success("saved")
        setIsAnOptionSelected(false)
        props.setAlreadyData((prev:any)=>{
            return{...prev, scene_frequency: sceneFrequencyOptions[(selectedIndex || 0)]}
          })
      })
      .catch((e:any)=>{
        toast.error("please try again!")
      })
    }
    useEffect(()=>{
        apiGet.get('/scene-frequency/')
        .then((res:any)=>{
            setSceneFrequencyOptions(res.data)
        })
        .catch((e:any)=>{
            toast.error("can't fetch options, please reload")
        })
    },[])

    return(
        <Accordion type="single" collapsible className={"w-full max-w-md mx-auto rounded-xl border-1 " + (props.isComplete ? "border-[#4BC761] bg-[#F2FFF5]":"border-[#E2E2E2] bg-[#F5F5F5]")}>
        <AccordionItem value="night-out" className=" px-4 py-1 rounded-xl ">
          <AccordionTrigger className="text-left text-black text-sm font-medium] items-center">
          <div className="flex items-center flex-wrap">
                how often do you go out?
                {props.isComplete && <span className="ml-2 p-1 bg-[#4BC761] rounded-full">
                    <Check color="#ffffff" className="w-2 h-2"/>
                    </span>}
                </div>
          </AccordionTrigger>
          <AccordionContent className="overflow-hidden text-sm">
            <div className="space-y-4">
          {sceneFrequencyOptions.map((option: SceneFreuencyOptions, index: number) => (
            <div
              key={`${option.id}`}
              className="flex items-center space-x-3 rounded-lg bg-[#ffffff] px-4 py-3 cursor-pointer"
              onClick={() => toggleIdentity(option.id, index)}
            >
              <Checkbox
                id={`${option.id}`}
                checked={selectedOption === option.id}  
                onCheckedChange={() => toggleIdentity(option.id, index)}
                className="border-muted-foreground/30 data-[state=checked]:bg-[#4BC761] data-[state=checked]:border-[#4BC761] data-[state=checked]:text-white"
              />
              <Label htmlFor={`${option.id}`} className="text-sm font-normal cursor-pointer">
                {option.scene_frequency_name}
              </Label>
            </div>
          ))}
          </div>
            <div className="grid grid-cols-2 justify-between pt-4 gap-2">
              <Button variant="ghost" 
              className="col-span-1 rounded-lg bg-[#E8E8E8]"
              >discard</Button>
              <Button className="col-span-1 rounded-lg bg-[#4E55E1]"
              disabled={!isAnOptionSelected}
              onClick={()=>{handleSave()}}
              >save</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
}