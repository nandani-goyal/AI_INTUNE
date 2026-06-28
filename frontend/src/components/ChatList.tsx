import { useEffect, useState } from "react";

interface MatchUser {
  id: string;
  name: string;
  matchPercentage: number;
  lastMessage: string;
  timeAgo: string;
  tags: string[];
  passKey: string;
  isOnline: boolean;
}

interface Props {
  selectedUser: MatchUser | null;
  onUserSelect: (user: MatchUser) => void;
}

const ChatList = ({ selectedUser, onUserSelect }: Props) => {

  const [matches, setMatches] = useState<MatchUser[]>([]);

  useEffect(() => {

    fetchMatches();

  }, []);

  const fetchMatches = async () => {

    try{

      const token=localStorage.getItem("token");

      const res=await fetch(

        "http://localhost:5000/api/matches",

        {

          headers:{

            Authorization:`Bearer ${token}`

          }

        }

      );

      const data=await res.json();

      const formatted=data.map((match:any)=>({

        id:match.user2._id,

        name:match.user2.anonymousId,

        matchPercentage:match.score,

        lastMessage:"",

        timeAgo:"",

        tags:[],

        passKey:"",

        isOnline:true

      }));

      setMatches(formatted);

    }

    catch(err){

      console.log(err);

    }

  };

  return(

    <div className="p-4">

      <h2 className="text-2xl font-bold mb-5">

        Your Matches

      </h2>

      {

        matches.map(user=>(

          <div

            key={user.id}

            onClick={()=>onUserSelect(user)}

            className={`

            cursor-pointer

            rounded-lg

            border

            p-4

            mb-3

            ${selectedUser?.id===user.id

            ?"bg-blue-100"

            :"bg-white"}

            `}

          >

            <h3>{user.name}</h3>

            <p>{user.matchPercentage}% Match</p>

          </div>

        ))

      }

    </div>

  );

};

export default ChatList;