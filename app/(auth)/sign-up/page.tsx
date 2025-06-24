import { LoginForm } from '@/components/login-form'
import React from 'react'

const page = () => {
  return (
      <div className="flex min-h-screen flex-col items-center justify-center p-2">
        <div className="w-full max-w-2xl md:max-w-5xl scale-100 md:scale-115 mb-0 pb-0">
          <LoginForm type="sign-up"/>
        </div>
    </div>    

  )
}

export default page