import connectDB from "../../../utils/connectmongo";
import Register from "@/model/registerSchema";
import mongoose from "mongoose";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  const renderPage = ({ title, message, showButton = true }) => {

    return `
<!DOCTYPE html>
<html>
<head>
<title>Eduquizz Account Activation</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>

body{
  margin:0;
  font-family:Arial, Helvetica, sans-serif;
  background:#f4f6f9;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}

.container{
  background:white;
  width:450px;
  border-radius:10px;
  overflow:hidden;
  box-shadow:0 12px 28px rgba(0,0,0,0.12);
  text-align:center;
}

.header{
  background:#3a6ea5;
  color:white;
  padding:20px;
  font-size:20px;
  font-weight:bold;
}

.content{
  padding:40px;
}

.logo{
  margin-bottom:20px;
}

.logo img{
  width:90px;
  height:auto;
}

h2{
  margin-top:15px;
  color:#333;
}

p{
  color:#666;
  font-size:15px;
  margin-top:10px;
}

.button{
  display:inline-block;
  margin-top:25px;
  padding:12px 26px;
  background:#3a6ea5;
  color:white;
  text-decoration:none;
  border-radius:6px;
  font-weight:bold;
}

.button:hover{
  background:#2e5c8f;
}

.footer{
  background:#f2f2f2;
  padding:15px;
  font-size:13px;
  color:#666;
}

.footer a{
  color:#3a6ea5;
  text-decoration:none;
}

</style>

</head>

<body>

<div class="container">

<div class="header">
Eduquizz Global Limited
</div>

<div class="content">

<div class="logo">
<img src="https://www.eduquizzglobal.com/logo.jpg" alt="Eduquizz Logo"/>
</div>

<h2>${title}</h2>

<p>${message}</p>

${showButton ? `
<a class="button" href="https://www.eduquizzglobal.com/login">
Login to Your Account
</a>
` : ""}

</div>

<div class="footer">
© ${new Date().getFullYear()} Eduquizz Global Limited<br/>
Need help? <a href="mailto:eduquizz5457@gmail.com">Contact Support</a>
</div>

</div>

</body>
</html>
`;
  };

  try {

    const { id } = req.query;
    console.log("id", id)

    await connectDB();

    res.setHeader("Content-Type", "text/html");

    // Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.send(
        renderPage({
          title: "Invalid Activation Link",
          message: "The activation link you used is invalid.",
          showButton: false
        })
      );
    }

    const user = await Register.findById(id);
    console.log("ac", user)

    if (!user) {
      return res.send(
        renderPage({
          title: "User Not Found",
          message: "This account does not exist.",
          showButton: false
        })
      );
    }

    if (user.activate.useractivated=== 'true') {
      return res.send(
        renderPage({
          title: "Account Already Activated",
          message: "Your account is already active. You can login."
        })
      );
    }
 
    // Activate account
    user.activate.useractivated='true';
 
    await user.save();

    return res.send(
      renderPage({
        title: "Account Activated Successfully",
        message: "Your account is now active. You can login and start using Eduquizz."
      })
    );

  } catch (error) {

    console.error(error);

    res.setHeader("Content-Type", "text/html");

    return res.status(500).send(
      renderPage({
        title: "Server Error",
        message: "Something went wrong. Please try again later.",
        showButton: false
      })
    );

  }
}