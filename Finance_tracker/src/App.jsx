import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import FinanceTracker from "./Components/FinanceTracker";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Clerk Sign In / Sign Up pages */}
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />

          {/* Protected Finance Tracker */}
          <Route
            path="/financeTracker"
            element={
              <>
                <SignedIn>
                  <FinanceTracker />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </BrowserRouter>

      {/* Header with Clerk buttons */}
      <header>
        <SignedOut>
          <a href="/sign-in">Sign In</a> | <a href="/sign-up">Sign Up</a>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </header>
    </>
  );
}

export default App;
