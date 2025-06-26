"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import { Input } from "@/components/ui/input";
import { 
  Instagram, 
  Linkedin, 
  Check, 
  CornerUpLeft,
  UploadCloud,
  X as Cross,
  RotateCcw as Retry,
  Search,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  apiGet, 
  apiPost 
} from "@/lib/api/base";
import { toast } from "sonner";
import { 
  useSearchParams, 
  usePathname, 
  useRouter 
} from 'next/navigation';
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import ImageCropper from "@/components/ImageCropper";


function getCookie(name:string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

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

export default function Questions(){
    const [questionNumber, setQuestionNumber] = useState(1);
    const [complete, setComplete] = useState(false);
    const [alreadyData, setAlreadyData] = useState<AlreadyDataType | null>(null);
    const [handleNextFunction, setHandleNextFunction] = useState<(() => Promise<void>) | null>(null);
    const searchParams = useSearchParams()
    const router = useRouter();
    const pathname = usePathname();
    const params = searchParams.get("question")
    const handleBack = () =>{
        if(questionNumber !== 1){
            setQuestionNumber(prev => prev - 1);
        }
        else{
            window.history.back();
        }
    }
    useEffect(()=>{
        if(questionNumber === 5){
          window.location.href = "/"
        }
        if(questionNumber === 12){
          setComplete(true);
      }else{
        setComplete(false);
      }
        switch (questionNumber) {
          case 1:
            router.push(`${pathname}?question=${encodeURIComponent("identity")}`, { scroll: false });
            break;
          case 2:
            router.push(`${pathname}?question=${encodeURIComponent("profile-pic")}`, { scroll: false });
            break;
          case 3:
            router.push(`${pathname}?question=${encodeURIComponent("college")}`, { scroll: false });
            break;
          case 4:
            router.push(`${pathname}?question=${encodeURIComponent("graduation-year")}`, { scroll: false });
            break;
          case 5:
            router.push(`${pathname}?question=${encodeURIComponent("branch")}`, { scroll: false });
            break;
          case 6:
            router.push(`${pathname}?question=${encodeURIComponent("nostalgia")}`, { scroll: false });
            break;
          case 7:
            router.push(`${pathname}?question=${encodeURIComponent("travel-type")}`, { scroll: false });
            break;
          case 8:
            router.push(`${pathname}?question=${encodeURIComponent("about")}`, { scroll: false });
            break;
          case 9:
            router.push(`${pathname}?question=${encodeURIComponent("scene-frequency")}`, { scroll: false });
            break;
          case 10:
            router.push(`${pathname}?question=${encodeURIComponent("who-is-around")}`, { scroll: false });
            break;
          case 11:
            router.push(`${pathname}?question=${encodeURIComponent("social")}`, { scroll: false });
            break;
          case 12:
            router.push(`${pathname}?question=${encodeURIComponent("complete")}`, { scroll: false });
            break;
          default:
            break;
        }
  },[questionNumber])

  useEffect(()=>{
    switch (params) {
      case decodeURIComponent("identity"):
        setQuestionNumber(1);
        break;
      case decodeURIComponent("profile-pic"):
        setQuestionNumber(2);
        break;
        break;
      case decodeURIComponent("college"):
        setQuestionNumber(3);
        break;
      case decodeURIComponent("graduation-year"):
        setQuestionNumber(4);
        break;
      case decodeURIComponent("branch"):
        setQuestionNumber(5);
        break;
      case decodeURIComponent("nostalgia"):
        setQuestionNumber(6);
        break;
      case decodeURIComponent("travel-type"):
        setQuestionNumber(7);
        break;
      case decodeURIComponent("about"):
        setQuestionNumber(8);
        break;
      case decodeURIComponent("scene-frequency"):
        setQuestionNumber(9);
        break;
      case decodeURIComponent("who-is-around"):
        setQuestionNumber(10);
        break;
      case decodeURIComponent("social"):
        setQuestionNumber(11);
        break;
      case decodeURIComponent("complete"):
        setQuestionNumber(12);
        break;
      default:
        break;
    }
  },[])
  useEffect(()=>{
    apiGet.get("/user/questions/")
    .then((res:any)=>{
      setAlreadyData(res.data)
    })
    .catch((e:any)=>{
      toast.error("server is not respoding")
    })
  },[])
    return(
        <div>
            <div className="flex mt-[20px] mx-[20px]">
                <div className="p-2 rounded-full border-[#EDEDED] border-2"
                onClick={handleBack}
                >
                    <CornerUpLeft color="#000000" 
                    size={20}/>
                </div>
            </div>
            <div className="mb-1 mt-2">
                {!complete && <QuestionProgression questionNumber={questionNumber} totalQuestions={3}/>}
            </div>
            {questionNumber === 1 && <IdentityQuestion setQuestionNumber={setQuestionNumber} 
            identity={alreadyData?.identity || null}
            setAlreadyData={setAlreadyData}
            />}
            {questionNumber === 2 && <ProfilePicUpload setQuestionNumber={setQuestionNumber} 
            profile_pic_url={alreadyData?.profile_pic_url || null}
            setAlreadyData={setAlreadyData}
            />}
            {/* {questionNumber === 3 && <CollegeQuestion setQuestionNumber={setQuestionNumber} 
            college={alreadyData?.college || null}
            setAlreadyData={setAlreadyData}
            />} */}
            {questionNumber === 3 && <CollegeBranchYearQuestion setQuestionNumber={setQuestionNumber} 
            college={alreadyData?.college || null}
            year={alreadyData?.yearOfGraduation || null}
            branch={alreadyData?.branch || null}
            setAlreadyData={setAlreadyData}
            />}
            {/* {questionNumber === 4 && <YearQuestion setQuestionNumber={setQuestionNumber} 
            yearOfGraduation={alreadyData?.yearOfGraduation || 2025}
            setAlreadyData={setAlreadyData}
            />}
            {questionNumber === 5 && <BranchQuestion setQuestionNumber={setQuestionNumber} 
            branch={alreadyData?.branch || null}
            setAlreadyData={setAlreadyData}
            />}
            {questionNumber === 6 && <NostalgiaQuestion setQuestionNumber={setQuestionNumber} 
            nostalgias={alreadyData?.nostalgias || []}
            setAlreadyData={setAlreadyData}
            />}
            {questionNumber === 7 && <TravelTypeQuestion setQuestionNumber={setQuestionNumber} 
            travel_type={alreadyData?.travel_type || null}
            setAlreadyData={setAlreadyData}
            
            />}
            {questionNumber === 8 && <AboutQuestion setQuestionNumber={setQuestionNumber} 
            about={alreadyData?.about || null}
            setAlreadyData={setAlreadyData}
            />}
            {questionNumber === 9 && <SceneFrequencyQuestion setQuestionNumber={setQuestionNumber} 
            identity={alreadyData?.scene_frequency || null}
            setAlreadyData={setAlreadyData}
            />}
            {questionNumber === 10 && <WhoIsAroundQuestion setQuestionNumber={setQuestionNumber} 
            identity={alreadyData?.who_is_around || null}
            setAlreadyData={setAlreadyData}
            />}
            {questionNumber === 11 && <SocialQuestion setQuestionNumber={setQuestionNumber} 
            instagram_id={alreadyData?.instagram_id || ""}
            linkedin_id={alreadyData?.linkedin_id || ""}
            setAlreadyData={setAlreadyData}
            />} */}
            {questionNumber === 4 && <QuestionsCompleted setQuestionNumber={setQuestionNumber}/>}

            </div>
        
    );
}

function NextButton(props: {handleNextQuestion: any, isAnOptionSelected: boolean , text?: string, skip?:boolean, handleSkip?:any}){
    return(
      <div className="w-full">
      <div className="fixed bottom-0 left-0 w-full flex flex-col items-center p-4">
        {props.skip && 
          <Button className="w-full max-w-md border-1 border-[#A3A3A3] text-[#A3A3A3] text-base font-semibold py-7 mb-2"
          variant={"outline"}
          onClick={()=>{
            props?.handleSkip()
          }}
          >
              skip
          </Button>
        }
        <Button 
          className={cn("w-full max-w-md bg-[#E7E7E7] py-7", props.isAnOptionSelected && "bg-[#4E55E1]")} 
          onClick={()=>{
            if(props.isAnOptionSelected){
              props.handleNextQuestion()
            }else{
              toast.error("this field is required")
            }
          }}
        >
          <div className={cn("text-[#A3A3A3] text-base font-semibold", props.isAnOptionSelected && "text-[#FFFFFF]")}>
            {props?.text || "next"}
          </div>
        </Button>
      </div>
    </div>
    );
}
interface IdentityOption {
    id: number
    identity_name: string
  }
  
  function IdentityQuestion(props: {setQuestionNumber: any, identity:any, setAlreadyData: any}) {
    const [identityOptions, setIdentityOptions] = useState<IdentityOption[]>([])
    const [selectedIdentity, setSelectedIdentity] = useState<number | null>(props?.identity?.id || null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    useEffect(() => {
      const fetchIdentityOptions = async () => {
          setLoading(true)
          await apiGet.get('/identities/')
          .then((res: any)=>{
            setLoading(false)
            setIdentityOptions(res.data)
          })
          .catch((e:any)=>{
            toast.error("can't fetch details , please reload")
          })
      }
      
      fetchIdentityOptions()
    }, [])
    useEffect(()=>{
      if(props.identity){
        setSelectedIdentity(props.identity?.id || null)
        setIsAnOptionSelected(true)
      }
    },[props.identity])
    const toggleIdentity = (id: number, index:number) => {
      setSelectedIdentity(id)
      setIsAnOptionSelected(true)
      props.setAlreadyData((prev:any)=>{
        return{...prev, identity: identityOptions[index]}
      })
    }

  
    const handleNextQuestion = async () => {
      if (!selectedIdentity) {
        setError("Please select an identity.")
        return
      }
      setLoading(true)
      setError(null)
      
      try {
        const userId = localStorage.getItem("userId");
        await apiPost.post('/identities/', { 
            identity_id: selectedIdentity ,
            user_id: userId,
        })
        props.setQuestionNumber((prev: number) => prev + 1);
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    if (loading) {
      return <div className="text-muted-foreground">Loading identity options...</div>
    }
  
    if (error) {
      return <div className="text-destructive">{error}</div>
    }
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">how do you identify?</h1>
  
        <div className="space-y-2">
          {identityOptions.map((option, index) => (
            <div
              key={`${option.id}`}
              className="flex items-center space-x-3 rounded-lg bg-muted/40 p-4 cursor-pointer"
              onClick={() => toggleIdentity(option.id, index)}
            >
              <Checkbox
                id={`${option.id}`}
                checked={selectedIdentity === option.id}  
                onCheckedChange={() => toggleIdentity(option.id, index)}
                className="border-muted-foreground/30 data-[state=checked]:bg-[#4BC761] data-[state=checked]:border-[#4BC761] data-[state=checked]:text-white"
              />
              <Label htmlFor={`${option.id}`} className="text-lg font-normal cursor-pointer">
                {option.identity_name}
              </Label>
            </div>
          ))}
        </div>
        <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected}/>
      </div>
    )
  }

function ProfilePicUpload(props: {setQuestionNumber: any, profile_pic_url: string | null, setAlreadyData:any}){
  const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number |null>(null);

  const handleSkip = () =>{
    props.setQuestionNumber((prev: number) => prev + 1);
  }
  useEffect(()=>{
    setPreviewUrl(props?.profile_pic_url || null);
    if(props.profile_pic_url){
      setIsAnOptionSelected(true)
      setUploadStatus(5)
    }
  },[props.profile_pic_url])

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
    setPreviewUrl(URL.createObjectURL(file));
    setUploadStatus(6)

  };

  const handleCrop=(file:any)=>{
    props.setAlreadyData((prev:any)=>{
      return {...prev, profile_pic_url:URL.createObjectURL(file)}
    })
    setPreviewUrl(URL.createObjectURL(file))
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
      setIsAnOptionSelected(true)
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
        setIsAnOptionSelected(true)
      })
      .catch((e:any)=>{
        setUploadStatus(4)
      })
    }else{
      toast.error("please select a file")
    }
  }
  const handleNextQuestion = () =>{
    props.setQuestionNumber((prev:any)=> prev+1)
  }
  return(
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold tracking-tight mb-6">beauty lies in the eyes of the beholder & we believe our social deserves your face :)</h1>
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
      <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected} skip={true} handleSkip={handleSkip}/>
    </div>
  );
}

function AboutQuestion(props: {setQuestionNumber: any, about: string | null, setAlreadyData: any}) {
  const [about, setAbout] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)

  useEffect(()=>{
    if(props.about){
      setAbout(props.about)
      setIsAnOptionSelected(true)
    }
  },[props.about])
  const handleNextQuestion = async () => {
    if (!about.trim()) {
      setError("Please enter something about yourself.")
      return
    }
    setLoading(true)
    setError(null)
      await apiPost.post('/user/about/', {
          about,
          user_id: localStorage.getItem("userId"),
      })
      .then((res:any)=>{
        props.setAlreadyData((prev:any)=>{
          return {...prev, about: about}
        })
        props.setQuestionNumber((prev: number) => prev + 1);
      })
      .catch((e:any)=>{
        toast.error("please try again , server is not responding")
      })

  }
  const handleSkip = () =>{
    props.setQuestionNumber((prev: number) => prev + 1);
  }
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">what is your idea of a good night out?</h1>

      <textarea
        className="w-full border rounded-lg p-4 bg-muted/40 focus:outline-none"
        placeholder="someone wants to know you personally 🙂"
        value={about}
        onChange={(e) => {
          setAbout(e.target.value)
          if(e.target.value.length === 0){
            setIsAnOptionSelected(false)
          }else{
          setIsAnOptionSelected(true)
          }
        }}
        rows={4}
      />

      {error && <p className="text-red-500 mt-2">{error}</p>}
      <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected} skip={true} handleSkip={handleSkip}/>
    </div>
  )
}

  interface College {
    id: number,
    college_name: string
  }
  
  function CollegeQuestion(props: {setQuestionNumber: any, college: College | null, setAlreadyData: any, setCollege: any}) {
    const [Colleges, setColleges] = useState<College[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredColleges, setFilteredColleges] = useState<College[]>([])
    const [selectedCollege, setSelectedCollege] = useState<{ id: number; college_name: string } | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)

    useEffect(() => {
      const fetchColleges = async () => {
          await apiGet.get('/colleges/')
          .then((res: any)=>{
            setColleges(res.data)
          })
          .catch((e:any)=>{
            toast.error("please reload! failed to fetch colleges")
          })
    
      }
  
      fetchColleges()
    }, [])
  
    useEffect(() => {
      if (searchTerm) {
        setFilteredColleges(
          Colleges.filter((college) =>
            college.college_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      } else {
        setFilteredColleges([])
      }
    }, [searchTerm, Colleges])
  
    const handleSelectCollege = (college: College, index:number) => {
      setFilteredColleges([])
      setSelectedCollege(college)
      setSearchTerm(college.college_name) // Show selected college in input box
      setIsAnOptionSelected(true) // Hide dropdown
      props.setCollege(college)
    }

    useEffect(()=>{
      if(props.college){
        setSelectedCollege({id: props.college.id, college_name: props.college.college_name})
        setSearchTerm(props.college.college_name)
        setIsAnOptionSelected(true)
      }
    },[props.college])
  
    const handleNextQuestion = async () => {
      if (!selectedCollege) {
        toast.error("please select a college")
        return
      }
  
        const userId = localStorage.getItem("userId");
        await apiPost.post('/colleges/', {
            college_id: selectedCollege.id ,
            user_id: userId   ,
        })
        .then((res:any)=>{
          // props.setAlreadyData(())
          props.setQuestionNumber((prev: number) => prev + 1);
        })
        .catch((e:any)=>{
          toast.error("request failed , please try again")
        })
    }
  
    return (
      <div className="w-full max-w-md  px-6 pt-6">
        <h1 className="text-2xl font-bold mb-4">your college ?</h1>
  
        <div className="flex items-center border-0 p-1 bg-[#F5F5F5] rounded-lg">
        <div className="mr-2 ml-2">
          <Search color="#818181" size={20}/>
        </div>
          <input
            type="text"
            placeholder="where your parents sent you to study"
            className="w-full py-3 px-2 rounded-lg outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => setTimeout(() => setFilteredColleges([]), 50)}
          />
        </div>
        {/* Dropdown List */}
        <div className="relative">
        {filteredColleges.length > 0 && (
            <ul className="absolute w-full bg-white border rounded-lg overflow-y-auto max-h-40 z-1">
              {filteredColleges.map((college, index) => (
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
        {/* <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected}/> */}
      </div>
    )
  }

  function CollegeBranchYearQuestion(props: {setQuestionNumber: any, setAlreadyData: any, college: College | null, branch: Branch | null, year: number | null}) {
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    const [college, setCollege] = useState<College | null>(null)
    const [branch, setBranch] = useState<Branch | null>(null)
    const [year, setYear] = useState<number>(2025)
    const [collegeUpdated, setCollegeUpdated] = useState<boolean>(false)
    const [branchUpdated, setBranchUpdated] = useState<boolean>(false)
    const [yearUpdated, setYearUpdated] = useState<boolean>(false)
    const [nextText, setNextText] = useState("create profile")
    useEffect(()=>{
      if(props.college){
        setCollege(props.college)
      }
      if(props.branch){
        setBranch(props.branch)
      }
      if(props.year){
        setYear(props.year)
      }
    },[props.college, props.branch, props.year])
    useEffect(()=>{
      if(college && branch && (!isNaN(year) && year >= 1900 && year <= 2030)){
        setIsAnOptionSelected(true)
      }else{
        setIsAnOptionSelected(false)
      }
    },[college, branch, year])
    useEffect(()=>{
      if(collegeUpdated && branchUpdated && yearUpdated){
        setNextText("creating your profile ...")
        setTimeout(()=>{
          props.setQuestionNumber((prev:any)=>prev+1)
        }, 4000)
      }
    },[collegeUpdated, branchUpdated, yearUpdated])
    const handleNextQuestion = async () => {
      try{
          apiPost.post('/user/collegeyearbranch/',{
            year: year,
            college_id: college?.id,
            branch_id: branch?.id,
          })
          .then((res:any)=>{
            props.setAlreadyData((prev:any) => {
              return {...prev, college: college, branch: branch, yearOfGraduation: year}
            })
            props.setQuestionNumber((prev:any)=>prev+1)
          })
      }catch(e){
        toast.error("request.failed, please try again")
      }
    };
    return (
      <div className="space-y-4">
        <CollegeQuestion setQuestionNumber={props.setQuestionNumber} college={college} setAlreadyData={props.setAlreadyData} setCollege={setCollege}  />
        <YearQuestion setQuestionNumber={props.setQuestionNumber} yearOfGraduation={year} setAlreadyData={props.setAlreadyData}setYear={setYear}/>
        <BranchQuestion setQuestionNumber={props.setQuestionNumber} branch={branch} setAlreadyData={props.setAlreadyData} setBranch={setBranch}/>
        <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected} text={nextText}/>
      </div>
    );
  }

  function YearQuestion(props: {setQuestionNumber: any, yearOfGraduation: number | null, setAlreadyData: any, setYear: any}) {
    const [year, setYear] = useState<number>(2025)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(true)
  
    useEffect(()=>{
      if(props.yearOfGraduation){
        setYear(props.yearOfGraduation)
      }
    },[props.yearOfGraduation])
  const handleNextQuestion = async () => {
      
      try {
          await apiPost.post('/user/year_update/', {
              year
          })
          .then((res:any)=>{
            props.setAlreadyData((prev:any)=>{
              return {...prev, yearOfGraduation: year}
            })
            props.setQuestionNumber((prev:any)=>prev+1)
          })
          .catch((e:any)=>{
            toast.error("server is not responding")
          })
  
      } catch (err) {
          setError((err as Error).message)
      } finally {
          setLoading(false)
      }
        }
  
      const isNumeric = (str: string) => /^\d+$/.test(str);
      return(
              <div className="w-full max-w-md mx-auto px-6">
                <h1 className="text-2xl font-bold tracking-tight mb-8">graduation year ?</h1>
          
                <div className="space-y-4">
                  <div className="relative">
                  <Input
                      className="p-4 bg-muted/40 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                      placeholder="year goes here"
                      value={year.toString().replace(/^0+/, '')}
                      type="number"
                      onChange={(e) => {
                        // Remove leading zeros using regex
                        const inputValue = e.target.value.toString().replace(/^0+/, '');
                        const value = Number(inputValue);
                        setYear(value);
                        props.setYear(Number(value));
                        if (!isNaN(value) && value >= 1900 && value <= 2030) {
                          setIsAnOptionSelected(true);
                        } else {
                          setIsAnOptionSelected(false);
                        }
                      }}
                    />
                  </div>
                </div>
          
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {/* <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected}/> */}
              </div>
      );
  }
  
  // branch question 
  interface Branch {
    id: number
    branch_name: string, 
    branch_slug: string,
  }
  
  function BranchQuestion(props: {setQuestionNumber: any, branch: Branch | null, setAlreadyData: any, setBranch: any}){
    const [branches, setBranches] = useState<Branch[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([])
    const [selectedBranch, setSelectedBranch] = useState<{ id: number; branch_name: string; branch_slug:string } | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    useEffect(() => {
      const fetchBranches = async () => {
          await apiGet.get('/branches/')
          .then((res: any)=>{
            setBranches(res.data)
          })
          .catch((e:any)=>{
            toast.error("please reload , failed to fetch branches")
          })
      }
  
      fetchBranches()
    }, [])

    useEffect(()=>{
      if(props.branch){
        setSelectedBranch(props.branch)
        setSearchTerm(props.branch.branch_name)
        setIsAnOptionSelected(true)
      }
    },[props.branch])
  
    useEffect(() => {
      if (searchTerm) {
        setFilteredBranches(
          branches.filter((branch) =>
            branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      } else {
        setFilteredBranches([])
      }
    }, [searchTerm, branches])
  
    const handleSelectBranch = (branch: Branch) => {
      setSelectedBranch(branch)
      props.setBranch(branch)
      setSearchTerm(branch.branch_name.toLowerCase()) // Show selected college in input box
      setIsAnOptionSelected(true)
      setFilteredBranches([]) // Hide dropdown
    }
  
    const handleNextQuestion = async () => {
      if (!selectedBranch) {
        alert("Please select a college")
        return
      }
  
      try {
        const userId = localStorage.getItem("userId");
        await apiPost.post('/branches/', {
            branch_id: selectedBranch.id ,
            user_id: userId   ,
        })
        .then((res:any)=>{
          props.setAlreadyData((prev:any)=>{
            return {...prev, branch : selectedBranch}
          })
          props.setQuestionNumber((prev: number) => prev + 1);
        })
      } catch (error) {
        toast.error("server is not responding")
      }
    }
  
    return (
      <div className="w-full max-w-md mx-auto px-6">
        <h1 className="text-2xl font-bold mb-4">& branch?</h1>
  
        <div className="flex items-center border-0 p-1 bg-[#F5F5F5] rounded-lg">
        <div className="mr-2 ml-2">
          <Search color="#818181" size={20}/>
        </div>
          <input
            type="text"
            placeholder="don't be shy, civil ain't bad :)"
            className="w-full py-3 px-2 rounded-lg outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => setTimeout(() => setFilteredBranches([]), 50)}
          />
        </div>
        <div className="relative h-80 overflow-y-auto">
          {/* Dropdown List */}
          {filteredBranches.length > 0 && (
            <ul className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-auto">
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
        {/* <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected}/> */}
      </div>
    )
  }

  function NostalgiaQuestion(props: {setQuestionNumber: any, nostalgias: number[] | null, setAlreadyData: any}){
    const [nostalgiaIds, setNostalgiaIds] = useState<number[]>([]);
    const [nostalgia, setNostalgia] = useState<{"id":number, "nostalgia_name": string}[]>([]);
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false);
    const handleSelect = (id: number) => {
      if (nostalgiaIds.includes(id)) {
        // Remove the index
        setNostalgiaIds(prev => prev.filter(id => id !== id));
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
    useEffect(()=>{
      setNostalgiaIds(props?.nostalgias || [])
    },[props.nostalgias])
    useEffect(()=>{
      if(nostalgiaIds.length >0){
        setIsAnOptionSelected(true)
      }else{
        setIsAnOptionSelected(false)
      }
    },[nostalgiaIds])
    const handleNextQuestion = () =>{
      apiPost.post("/user/set-nostalgias/",{
        nostalgia_ids: nostalgiaIds,
      })
      .then((res:any)=>{
        props.setAlreadyData((prev:any)=>{
          return {...prev, nostalgias: nostalgiaIds}
        })
        props.setQuestionNumber((prev:any)=> prev+1)
      })
      .catch((e:any)=>{
        toast.error("please try again")
      })
    }

    useEffect(()=>{
      apiGet.get("/nostalgias")
      .then((res:any)=>{
        setNostalgia(res.data)
      })
      .catch((e:any)=>{
        toast.error("can't fetch please reload")
      })
    },[])
    return(
      <div className="w-full max-w-md mx-auto p-6">
        <div className="flex flex-wrap">
        <p className="text-3xl font-bold tracking-tight mb-6">what gives you instant nostalgia?<span className="text-[#AAAAAA] text-xl ml-1">(select up to 5)</span></p>
        </div>
        <div className="flex flex-wrap gap-4">
        {nostalgia.length === 0 && 
              Array(5).fill(null).map((_, index) => (
                  <Skeleton key={index} className="w-25 h-10"/>
              ))
        }
        {
          nostalgia.map((item:any, index:number)=>{
            if (nostalgiaIds.includes(item.id)){
              return(
                    <div
                        key={index}
                        className="py-2 px-4 border-1 border-[#4E55E1] 
                        bg-[#F1F1FD] rounded-lg text-[#4E55E1]"
                        onClick={()=>{handleSelect(item.id)}}>
                        {item.nostalgia_name}
                    </div>
              );
            }
            return(
              <div
                key={index}
                  className="py-2 px-4 border-1 border-[#E2E2E2] 
                  bg-[#F5F5F5] rounded-lg"
                  onClick={()=>{handleSelect(item.id)}}
                  >
                  {item.nostalgia_name}
          </div>
            );
          })
        }
        </div>
        <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected}/>
      </div>
    );
  }

  interface TravelTypeOption {
    id: number
    travel_type: string
    description: string
  }
  
  function TravelTypeQuestion(props: {setQuestionNumber: any, travel_type: number | null, setAlreadyData: any}) {
    const [travelTypes, setTravelTypes] = useState<TravelTypeOption[]>([])
    const [selectedType, setSelectedType] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    useEffect(() => {
      const fetchTravelTypes = async () => {
          await apiGet.get('/travel-types/')
          .then((res: any)=>{
            setTravelTypes(res.data)
          })
          .catch((e:any)=>{
            toast.error("please reload, failed to fetch colleges")
          })
      }
  
      fetchTravelTypes()
    }, [])

    useEffect(()=>{
      if(props.setAlreadyData){
        setSelectedType(props.travel_type)
        setIsAnOptionSelected(true)
      }
    },[props.travel_type])
  
    const handleSelect = (id: number) => {
      setSelectedType(id)
      setIsAnOptionSelected(true)
    }
  
    const handleNextQuestion = async () => {
      if (!selectedType) {
        setError("Please select a travel type.")
        return
      }
  
      setLoading(true)
      setError(null)
  
      try {
        const userId = localStorage.getItem("userId");
        await apiPost.post('/travel-types/', {
            travel_type_id: selectedType ,
            user_id: userId,
        })
        .then((res:any)=>{
          props.setAlreadyData((prev:any)=>{
            return {...prev, travel_type: selectedType}
          })
          props.setQuestionNumber((prev:any)=>prev+1);
        })
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
  
    if (loading) {
      return <div className="text-muted-foreground">Loading travel types...</div>
    }
  
    if (error) {
      return <div className="text-destructive">{error}</div>
    }
  
    return (
      <div className="w-full max-w-md mx-auto p-6 mb-[100px]">
        <h1 className="text-3xl font-bold tracking-tight mb-6">who are you when plans are happening?</h1>
  
        <div className="space-y-3">
          {travelTypes.map((option) => (
            <div
              key={option.id}
              className={`p-4 rounded-lg border cursor-pointer transition ${
                selectedType === option.id ? "bg-[#F5F5F5] border-2 border-[#4E55E1]" : "bg-muted/40"
              }`}
              onClick={() => handleSelect(option.id)}
            >
              <h2 className="text-lg font-bold">{option.travel_type}</h2>
              <p className="text-sm opacity-80">{option.description}</p>
            </div>
          ))}
        </div>
        <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected}/>
      </div>
    )
  }

  function TenOnTenQuestion(props: {setQuestionNumber: any, ten_on_ten: string | null, setAlreadyData: any}){
    const [tenOnTen, setTenOnTen] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)

    useEffect(()=>{
      if(props.ten_on_ten){
        setTenOnTen(props.ten_on_ten)
        setIsAnOptionSelected(true)
      }
    },[props.ten_on_ten])

    const handleNextQuestion = async () => {
      if (!tenOnTen.trim()) {
        setError("Please enter something about yourself.")
        return
      }
      setLoading(true)
      setError(null)
      apiPost.post('/user/ten-on-ten/', {
            ten_on_ten: tenOnTen,
        })
        .then((res:any)=>{
          props.setAlreadyData((prev:any)=>{
            return {...prev, ten_on_ten: tenOnTen}
          })
          props.setQuestionNumber(12);
        })
        .catch((e:any)=>{
          toast.error("please try again")
        })
    }

    const handleSkip = async () =>{
      props.setQuestionNumber(12)
    }
  
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">what make a trip 10/10 for you?</h1>
  
        <textarea
          className="w-full border rounded-lg p-4 bg-muted/40 focus:outline-none text-base"
          placeholder="sunsets, street food, and someone cute (you?)"
          value={tenOnTen}
          onChange={(e) => {
            setTenOnTen(e.target.value)
            if(e.target.value.length === 0){
              setIsAnOptionSelected(false)
            }else{
            setIsAnOptionSelected(true)
            }
          }}
          rows={4}
        />
  
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected} skip={true} handleSkip={handleSkip}/>
      </div>
    )
  }

  interface SceneFrequencyOption {
    id: number
    scene_frequency_name: string
  }
  
  function SceneFrequencyQuestion(props: {setQuestionNumber: any, identity:any, setAlreadyData: any}) {
    const [identityOptions, setIdentityOptions] = useState<SceneFrequencyOption[]>([])
    const [selectedIdentity, setSelectedIdentity] = useState<number | null>(props?.identity?.id || null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    useEffect(() => {
      const fetchIdentityOptions = async () => {
          setLoading(true)
          await apiGet.get('/scene-frequency/')
          .then((res: any)=>{
            setLoading(false)
            setIdentityOptions(res.data)
          })
          .catch((e:any)=>{
            toast.error("can't fetch details , please reload")
          })
      }
      
      fetchIdentityOptions()
    }, [])
    useEffect(()=>{
      if(props.identity){
        setSelectedIdentity(props.identity?.id || null)
        setIsAnOptionSelected(true)
      }
    },[props.identity])
    const toggleIdentity = (id: number, index:number) => {
      setSelectedIdentity(id)
      setIsAnOptionSelected(true)
      props.setAlreadyData((prev:any)=>{
        return{...prev, scene_frequency: identityOptions[index]}
      })
    }

    const handleSkip = () =>{
      props.setQuestionNumber((prev:any)=>prev+1)
    }
  
    const handleNextQuestion = async () => {
      if (!selectedIdentity) {
        setError("Please select an identity.")
        return
      }
      setLoading(true)
      setError(null)
      
      try {
        const userId = localStorage.getItem("userId");
        await apiPost.post('/scene-frequency/', { 
          scene_frequency_id: selectedIdentity ,
        })
        props.setQuestionNumber((prev: number) => prev + 1);
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    if (loading) {
      return <div className="text-muted-foreground">Loading identity options...</div>
    }
  
    if (error) {
      return <div className="text-destructive">{error}</div>
    }
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">what's your scene frequency?</h1>
  
        <div className="space-y-2 mb-[200px]">
          {identityOptions.map((option, index) => (
            <div
              key={`${option.id}`}
              className="flex items-center space-x-3 rounded-lg bg-muted/40 p-4 cursor-pointer"
              onClick={() => toggleIdentity(option.id, index)}
            >
              <Checkbox
                id={`${option.id}`}
                checked={selectedIdentity === option.id}  
                onCheckedChange={() => toggleIdentity(option.id, index)}
                className="border-muted-foreground/30 data-[state=checked]:bg-[#4BC761] data-[state=checked]:border-[#4BC761] data-[state=checked]:text-white"
              />
              <Label htmlFor={`${option.id}`} className="text-lg font-normal cursor-pointer">
                {option.scene_frequency_name}
              </Label>
            </div>
          ))}
        </div>
        <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected} skip={true} handleSkip={handleSkip}/>
      </div>
    )
  }

  interface WhoIsAroundOption {
    id: number
    who_is_around_name: string
  }

  function WhoIsAroundQuestion(props: {setQuestionNumber: any, identity:any, setAlreadyData: any}) {
    const [identityOptions, setIdentityOptions] = useState<WhoIsAroundOption[]>([])
    const [selectedIdentity, setSelectedIdentity] = useState<number | null>(props?.identity?.id || null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
    useEffect(() => {
      const fetchIdentityOptions = async () => {
          setLoading(true)
          await apiGet.get('/who-is-around/')
          .then((res: any)=>{
            setLoading(false)
            setIdentityOptions(res.data)
          })
          .catch((e:any)=>{
            toast.error("can't fetch details , please reload")
          })
      }
      
      fetchIdentityOptions()
    }, [])
    useEffect(()=>{
      if(props.identity){
        setSelectedIdentity(props.identity?.id || null)
        setIsAnOptionSelected(true)
      }
    },[props.identity])
    const toggleIdentity = (id: number, index:number) => {
      setSelectedIdentity(id)
      setIsAnOptionSelected(true)
      props.setAlreadyData((prev:any)=>{
        return{...prev, who_is_around: identityOptions[index]}
      })
    }

    const handleSkip = () =>{
      props.setQuestionNumber((prev:any)=>prev+1)
    }
  
    const handleNextQuestion = async () => {
      if (!selectedIdentity) {
        setError("Please select an identity.")
        return
      }
      setLoading(true)
      setError(null)
      
      try {
        const userId = localStorage.getItem("userId");
        await apiPost.post('/who-is-around/', { 
          who_is_around_id: selectedIdentity ,
        })
        props.setQuestionNumber((prev: number) => prev + 1);
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    if (loading) {
      return <div className="text-muted-foreground">Loading identity options...</div>
    }
  
    if (error) {
      return <div className="text-destructive">{error}</div>
    }
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">when you are out who is around?</h1>
  
        <div className="space-y-2 mb-[200px]">
          {identityOptions.map((option, index) => (
            <div
              key={`${option.id}`}
              className="flex items-center space-x-3 rounded-lg bg-muted/40 p-4 cursor-pointer"
              onClick={() => toggleIdentity(option.id, index)}
            >
              <Checkbox
                id={`${option.id}`}
                checked={selectedIdentity === option.id}  
                onCheckedChange={() => toggleIdentity(option.id, index)}
                className="border-muted-foreground/30 data-[state=checked]:bg-[#4BC761] data-[state=checked]:border-[#4BC761] data-[state=checked]:text-white"
              />
              <Label htmlFor={`${option.id}`} className="text-lg font-normal cursor-pointer">
                {option.who_is_around_name}
              </Label>
            </div>
          ))}
        </div>
        <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected} skip={true} handleSkip={handleSkip}/>
      </div>
    )
  }

function SocialQuestion(props: {setQuestionNumber:any, instagram_id: string, linkedin_id: string, setAlreadyData: any}){
    const [instagram, setInstagram] = useState("")
    const [linkedin, setLinkedin] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isAnOptionSelected, setIsAnOptionSelected] = useState(false)
const handleNextQuestion = async () => {

        await apiPost.post('/user/socials/', {
            instagram,
            linkedin,
            user_id: localStorage.getItem("userId"),
        })
        .then((res:any)=>{
          props.setAlreadyData((prev:any)=>{
            return {...prev, instagram_id: instagram, linkedin_id: linkedin}
          })
          props.setQuestionNumber((prev:any)=>prev+1);
        })
        .catch((e:any)=>{
          toast.error("server is not responding, please try again")
        })
      }
      const handleSkip = () =>{
        props.setQuestionNumber((prev:any)=>prev+1)
      }
      useEffect(()=>{
        if(props.instagram_id ){
          setInstagram(props.instagram_id)
        }
        if(props.linkedin_id ){
          setLinkedin(props.linkedin_id)
        }
        if(props.instagram_id && props.linkedin_id){
          setIsAnOptionSelected(true)
        }
      },[props.instagram_id, props.linkedin_id])

    useEffect(()=>{
      if(instagram && linkedin){
        setIsAnOptionSelected(true)
      }else{
        setIsAnOptionSelected(false)
      }
    },[instagram, linkedin])
    return(
            <div className="w-full max-w-md mx-auto p-6">
              <h1 className="text-3xl font-bold tracking-tight mb-8">where can people stalk—uh, follow—you?</h1>
        
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-10 bg-muted/40 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    placeholder="for the fire reels"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
        
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-10 bg-muted/40 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    placeholder="for the ones balancing work"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
              </div>
        
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={isAnOptionSelected} text={"create profile"} skip={true} handleSkip={handleSkip} />
            </div>
    );
}

function QuestionsCompleted(props:{setQuestionNumber: any}){
    const handleNextQuestion=()=>{
      props.setQuestionNumber((prev:any)=>prev+1)
    }
    return(
        <div>
          <div className="">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg max-w-sm mt-[100px]">
              {/* Green checkmark with ripple effect */}
              <div className="relative flex items-center justify-center w-[200px] h-[200px]">
                <div className="absolute w-full h-full bg-green-100 rounded-full animate-ping"></div>
                <div className="absolute w-2/3 h-2/3 bg-green-200 rounded-full animate-ping"></div>
                <div className="absolute w-1/3 h-1/3 bg-green-300 rounded-full"></div>
                <div className="p-4 z-10 bg-[#4BC761] rounded-full">
                <Check className="w-20 h-20" color="#ffffff"/>
                </div>
              </div>

              {/* Text Section */}
            </div>
            <div className="flex flex-col item-center justify-center">
            <h1 className="mt-6 text-xl font-bold text-black text-center">the scene is set!</h1>
              <p className="text-gray-500 text-sm mt-2 text-center">
                now let’s match you with fellow explorers
              </p>
            </div>
          </div>
          <NextButton handleNextQuestion={handleNextQuestion} isAnOptionSelected={true} text="start exploring"/>
        </div>
    );
}

function QuestionProgression(props:{questionNumber: number, totalQuestions: number}){
    return(
        <div className="flex gap-2 w-full justify-center mt-4 p-4">
      {Array.from({ length: props.totalQuestions }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-300 w-full",
            i < props.questionNumber ? "bg-[#4E55E1]" : "bg-gray-200",
          )}
        />
      ))}
    </div>
    );

}
