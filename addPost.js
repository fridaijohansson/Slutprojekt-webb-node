
//kopierat och anpassat till detta projekt från mitt GA

let postsDb = [{id:1, user:"frida123", title:"Sherlock", author:"Arthur Conan Doyle", description:"About a guy and his companion...", link:"https://www.google.se/", liked:false, posted:"00:00"},{id:2, user:"abc123", title:"Dexter", author:"Jeff Lindsey", description:"About a disguised killer", link:"https://www.google.se/",liked:false, posted:"00:00"}];


//Calling for a function to render the output
renderFakedata();  

//The callback function addTask will run when the even submit occurs through an event listener that listens to the specified ID "taskForm"
document.getElementById("taskForm").addEventListener("submit", addPost);

//this callback function will add a new task when called
function addPost(event){

    //Stops the default event to take place
    event.preventDefault();

        title = title.trim();
        author = author.trim();
        link = link.trim();

        if(!title && !author && !link) return;

        const post = {
            title: title,
            author: author,
            description:description,
            link: link,
            liked:false,
            posted: Date.now(),
            id:Date.now(),
            user: "Lasse123"
            //user = användarnamn
        };

        postsDb = [...postsDb, post];
        yourPosts = [...yourPosts, post];
        console.log(postsDb);


    //Getting the value of the ID "task" which is the text input
    

    //Pushing the new data into the Array created at row 2
    postsDb.push(post);

    //Recalls the render function of the output, this time with the new data
    renderFakedata();  

}

//Function to render the array to display in the browser
function renderFakedata(){

    //creating a copy of the array and displaying it with backticks through return -
    //with the callback function using the task object that will be displayed in the browser
    let output = postsDb.map(function(post){

        return `
            <div class="post-container">
                <div class="post-header">
                    <p>${post.user} ${post.posted}</p>
                    <button id="liked" class="post-btn">Liked</button>
                    <button id="saved" on:click={() => savePost(post)} class="post-btn">Save</button>
                </div>

                <div class="post-content">
                    <h2 class="italic">${post.title} <span>by</span> ${post.author}</h2>
                    <p>${post.description}</p>
                    <p><a href="${post.link}" target="_blank" >Listen to ${post.title}</a></p>
                </div>
            </div>
            
            <hr>
        `;  
        
    });

    //Displaying the objects with an <hr> tag inbetween them for separation
    document.getElementById("posts").innerHTML = output.reverse().join("");

}

// //Callback function for deleting tasks/objects 
// function deleteTask(index){

//     //Splice takes the given object out of the array
//     fakeDatabase.splice(index, 1);
//     //Rerender the displayed array again without the spliced object
//     renderFakedata();

// }
