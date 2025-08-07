// document
//   .getElementById("allForm")
//   .addEventListener("submit", async function (e) {
//     e.preventDefault(); // Prevent default form submission

//     const form = e.target;
//     const formData = new FormData(form);
//       const jsonData = Object.fromEntries(formData.entries());
//       const seid = {
//            product_url: document.querySelector("#allForm input[name=product_url")
//             .value,

//           product_name: document.querySelector(
//             "#allForm input[name=product_name"
//           ).value,

//           product_brief_description: document.querySelector(
//             "#allForm input[name=product_brief_description"
//           ).value,
//           product_description: document.querySelector(
//             "#allForm input[name=product_brief_description"
//           ).value,
//           product_image: document.querySelector(
//             "#allForm input[name= product_image]"
//           ).value,
//           product_link: document.querySelector(
//             "#allForm input[name= product_link]"
//           ).value,
//           starting_price: document.querySelector(
//             "#allForm input[name= starting_price]"
//           ).value,
//           price_range: document.querySelector(
//             "#allForm input[name= price_range]"
//           ).value,

//           user_name: document.querySelector("#allForm input[name=user_name]")
//             .value,
//           user_email: document.querySelector("#allForm input[name=user_email]")
//             .value,

//           user_password: document.querySelector(
//             "#allForm input[name=user_password]"
//           ).value,
//       }
//      fetch("http://localhost:5555/addiphone", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//          seid,
//         }),
//      })
//       .then(() => alert("successed"))
//       .catch((err)=>console.log(err))

//       const result = await response.text();
//       document.getElementById(
//         "result"
//       ).innerHTML = `<p style="color: green;">${result}</p>`;

  
//     //    (err) {
         
//     //   document.getElementById(
//     //     "result"
//     //   ).innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
//     // }
// });
