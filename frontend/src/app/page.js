"use client";
import { useState } from "react";
import LoginPage from "./login/page";

export default function Home() {

  const [name, setName] = useState("");

  const [form, setForm] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <>
      {/* <LoginPage /> */}
    </>
  );
}
