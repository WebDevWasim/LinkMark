//======================= Open Tabs  =========================//

function openPage(pageName, elmnt, color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "#777474";
    tablinks[i].style.color = "#fff";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;
  elmnt.style.color = "#5b5858";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// ================================= SCRIPT ============================ //

//============== LogIn & Sign Up Funtion =====================//

// ================================ Log In Function
$("#logIn").click(function() {
  var email = $("#email").val();
  var password = $("#password").val();
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function onSuccess() {
      //Check if the current URL contains '#'
      var num = document.URL.indexOf("#");
      if (document.URL.indexOf("#") == num) {
        // Set the URL to whatever it was plus "#".
        url = document.URL + "#";
        location = "#";

        //Reload the page
        location.reload(true);
      }
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error :" + errorMessage);
    });
});
// ================================= SignUp Funtion
$("#signUp").click(function() {
  var email = $("#createEmail").val();
  var password = $("#createPassword").val();
  var confirmPassword = $("#confirmPassword").val();
  if (password === confirmPassword) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function onSuccess() {
        //Check if the current URL contains '#'
        var num = document.URL.indexOf("#");
        if (document.URL.indexOf("#") == num) {
          // Set the URL to whatever it was plus "#".
          url = document.URL + "#";
          location = "#";

          //Reload the page
          location.reload(true);
        }
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Error :" + errorMessage);
      });
  } else {
    alert("Error: Your Password and Confirm Password do not match");
    document.getElementById("confirmPassword").focus();
  }
});

// =================================== Log Out Function
$("#logOut").click(function() {
  $("#title").show();
  firebase.auth().signOut();
});

// ====================================================================

//Check Auth/ logIn Status

firebase.auth().onAuthStateChanged(function(user) {
  // var user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.
    $("#loginSection").hide();
    $("#title").hide();
    $("#logonSection")
      .show()
      .ready(function() {
        $("#heading").html(user.email);
        // ================== Realtime Database ======================
        var rootRef = firebase
          .database()
          .ref(
            "/Linkmarks/" +
              user.email.replace(/[&\/\\#,+()$~%.'":*?<>{}]/gi, "")
          );
        // ==================== Add Links to database
        $("#addLink").click(function() {
          // Getting Input Value
          var siteName = $("#siteName").val();
          var siteUrl = $("#siteUrl").val();

          // Form Validation Effect (Add Link)
          if (siteName == "") {
            //alert("Please Enter Site Name");
            document.getElementById("siteName").focus();
            document.getElementById("siteName").style.border =
              "solid 1.5px red";
          } else {
            document.getElementById("siteName").style.border =
              "solid 1.5px green";
          }
          var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
          if (!regexp.test(siteUrl)) {
            //alert("Please Enter Valid URL");
            document.getElementById("siteUrl").focus();
            document.getElementById("siteUrl").style.border = "solid 1.5px red";
          } else {
            document.getElementById("siteUrl").style.border =
              "solid 1.5px green";
          }

          // Form Validation (Add Link)
          if (siteName && regexp.test(siteUrl)) {
            // Reset Input Fields
            $("#siteName").val("");
            $("#siteUrl").val("");

            rootRef
              .push({
                siteName: siteName,
                siteUrl: siteUrl
              })
              .then(function() {
                console.log("Link is Added to Database");
              });
          } else {
            //alert("Please fill Up");
          }
        });

        // ======================== Retrive Data from Database
        rootRef.once("value", function(snapshot) {
          rootRef.on("child_added", function(snapshot) {
            // do something here with added childs
            var linkName = snapshot.val().siteName;
            var linkUrl = snapshot.val().siteUrl;
            $("#linkList").prepend(`<p class="row">
          <span class="col-9"> <b>${linkName}</b></span> 
          <span class="col-3"> 
            <a class="btn btn-primary btn-md" id="visitLink" href="${linkUrl}" target="_blank"><i class="fas fa-external-link-alt"></i></a> 
            <a class="btn btn-info btn-md" id="editBtn"><i class="fas fa-edit"></i></a> 
            <a class="btn btn-danger btn-md" id="deleteLink"><i class="fas fa-trash-alt"></i></a> 
        </p>`);

            if ($("#linkList p").length > 0) {
              $("#noLinks").css("display", "none");
            }
            // ==================== Delete Links from database

            // open Edit modal
            // $("#openDeleteModal").click(function() {
            //   $("#deleteModal").slideToggle(400);
            //   $("#linkarea").css("display", "none");
            // });

            $("#deleteLink").click(function() {
              rootRef.child(snapshot.key).remove(function() {
                //Check if the current URL contains '#'
                var num = document.URL.indexOf("#");
                if (document.URL.indexOf("#") == num) {
                  // Set the URL to whatever it was plus "#".
                  url = document.URL + "#";
                  location = "#";

                  //Reload the page
                  location.reload(true);
                }
              });
            });

            // ==================== Update Links to database

            // Get the Edit modal
            var modal = document.getElementById("editModal");
            // open Edit modal
            $("#editBtn").click(function() {
              $("#editModal").slideToggle(400);
              $("#linkarea").css("visibility", "hidden");
              $("#modalsiteName").val(linkName);
              $("#modalsiteUrl").val(linkUrl);
              // Update Link
              $("#updateLink").click(function() {
                var siteName = $("#modalsiteName").val();
                var siteUrl = $("#modalsiteUrl").val();

                // Form Validation Effect (Modal Update Link Form)
                if (siteName == "") {
                  //alert("Please Enter Site Name");
                  document.getElementById("modalsiteName").focus();
                  document.getElementById("modalsiteName").style.border =
                    "solid 1.5px red";
                } else {
                  document.getElementById("modalsiteName").style.border =
                    "solid 1.5px green";
                }
                var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
                if (!regexp.test(siteUrl)) {
                  //alert("Please Enter Valid URL");
                  document.getElementById("modalsiteUrl").focus();
                  document.getElementById("modalsiteUrl").style.border =
                    "solid 1.5px red";
                } else {
                  document.getElementById("modalsiteUrl").style.border =
                    "solid 1.5px green";
                }

                // Form Validation (Modal Update Link Form)
                if (siteName && regexp.test(siteUrl)) {
                  data = { siteName, siteUrl };
                  rootRef.child(snapshot.key).update(data);
                  console.log("Link is Updated");
                  $("#editModal").slideUp(400, function() {
                    //Check if the current URL contains '#'
                    var num = document.URL.indexOf("#");
                    if (document.URL.indexOf("#") == num) {
                      // Set the URL to whatever it was plus "#".
                      url = document.URL + "#";
                      location = "#";

                      //Reload the page
                      location.reload(true);
                    }
                    $("#linkarea").css("display", "none");
                  });
                }
              });
            });

            // close the modal
            $(".cancel").click(function() {
              $("#editModal").slideUp(400);
              $("#linkarea").css("visibility", "initial");
              // $("#deleteModal").css("display", "none");
            });

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
              if (event.target == modal) {
                // modal.style.display = "none";
                $("#editModal").slideUp(400);
                $("#linkarea").css("visibility", "initial");
              }
            };
          });
        });
      });
  } else {
    // No user is signed in.
    $("#loginSection").show();
    $("#logonSection").hide();
  }
});

// ========================================================================================================================//
$(".accordion").click(function() {
  $("#linkarea").slideToggle(400);
  $("#toggleIcon").text(function(i, text) {
    return text === " + " ? " x " : " + ";
  });
});
