module.exports = function(posts){
    return`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="first-page.css">
    <title>First Page</title>
</head>
<body>
    <!--
        - offentlig sida, nyaste tillagda posts
        - knappar = ny post, star rating, sortera admin gillade posts
        - länkar = lista av sparade och sina egna posts, delade ljudböcker, (extra) visa profil
        fixa med svelte när node delen är färdig

    -->
    <header>
        <h1>Discover</h1>
    </header>
	
	
        <nav>
                <!--Searchbar, posts-->
            <button onclick="show('add')">New Post</button>
            <button onclick="show('posts')">Posts</button>

            <div id="search">
                <input type="text" placeholder="Searchbar">
                <button>Search</button>
            </div>
            
        </nav>
	





	
    

    <div id="main-container">
        <aside id="left-aside">
            <div id="profile">
                <div id="profile-img">
                
                </div>
                <div id="profile-text">
                    <p>username</p>
                    <p>Joined (time)</p>
                    <p>Posts</p>
                </div>

            </div>
            <div id="booklists">
                <h3>Your booklists</h3>
                <ul>
                    <li><a href="#" onclick="show('yourPosts')">Your posts</a></li>
                    <li><a href="#" onclick="show('saved')">Saved</a></li>
                </ul>
            </div>
            
            
        </aside>


        <main>
            <!--Bands, top 3 songs, edit, delete -->
            <div id="add" style="display: none;">
                <h3>Add an audiobook!</h3>
                <form action="/add" method="post" id="addForm">
                    <input type="text" name ="title" placeholder="Title">
                    <br>
                    <input type="text" name ="author" placeholder="Author">
                    <br>
                    <textarea name="description" id="description" cols="40" rows="10" placeholder="description"></textarea>
                    <br>
                    <input type="text" placeholder="link">
                    <input type="submit" value="submit">
                </form>
            </div>


            <div id="posts">
                ${posts}
            </div>
            <div id="saved" style="display: none;">

            </div>
            <div id="yourPosts" style="display: none;">

            </div>
            
            
        </main>
        <aside id="right-aside">

        </aside>


    </div>
    <script src="addPost"></script>
    <script>
        var divs = ["posts", "add", "saved", "yourPosts"];
        var visibleDivId = null;
        function show(divId) {
        if(visibleDivId === divId) {
            //visibleDivId = null;
        } else {
            visibleDivId = divId;
        }
        hideNonVisibleDivs();
        }
        function hideNonVisibleDivs() {
        var i, divId, div;
        for(i = 0; i < divs.length; i++) {
            divId = divs[i];
            div = document.getElementById(divId);
            if(visibleDivId === divId) {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        }
        }

    </script>
    
</body>
</html>
    
    
    
    
    
    `
}