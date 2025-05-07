"use client";

import { userAtom } from "@/storage/user";
import { Box, CircularProgress } from "@mui/material";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoadingPage() {

  const [user] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    console.log("Check user", user)
    if (user === null) {
      router.replace('/');
    }
    if (user !== null){
      if (user.role === 'student') {
        router.replace('/student/class-control'); // or '/' or '/login'
      }
      else if(user.role === 'professor') {
        router.replace('/professor/coursesview'); // or '/' or '/login'
      }
      else if(user.role === 'admin') {
        router.replace('/admin/account-control'); // or '/' or '/login'
      }
    }
  }, [user]);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'white', // optional: background color
      }}
    >
      <CircularProgress size={60} color="primary" />
    </Box>
  );
}