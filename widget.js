(function(window, document){"use strict";// Localize jQuery variables
var app_url=getDsmAppUrl();
var $sk_fb_page_reviews_grid_holder;

// loading animation
var el = document.getElementsByClassName('sk-ww-google-reviews')[0];

if(el==undefined){
    var el = document.getElementsByClassName('dsm-ww-fb-page-reviews')[0];
    el.className = "sk-ww-google-reviews";
}

el.innerHTML = "<div class='first_loading_animation' style='text-align:center; width:100%;'><img src='" + app_url + "images/ripple.svg' class='loading-img' style='width:auto !important;' /></div>";
// load css
loadCssFile(app_url + "libs/js/swiper/swiper.min.css");
loadCssFile(app_url + "libs/js/swiper/swiper.css?v=ranndomchars");


loadCssFile(app_url + "embed/libs/js/magnific-popup/magnific-popup.css");
loadCssFile(app_url + "embed/google-reviews/widget_css.php");
loadCssFile("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");/******** Load jQuery if not present *********/
if (window.jQuery === undefined) {
     var script_tag = document.createElement('script');
     script_tag.setAttribute("type","text/javascript");
     script_tag.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js");
     if (script_tag.readyState) {
       script_tag.onreadystatechange = function () { // For old versions of IE
           if (this.readyState == 'complete' || this.readyState == 'loaded') {
               scriptLoadHandler();
           }
       };
     } else {
       script_tag.onload = scriptLoadHandler;
     }
     // Try to find the head, otherwise default to the documentElement
     (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
 } else {
     // The jQuery version on the window is the one we want to use
     jQuery = window.jQuery;
     scriptLoadHandler();
 }

 /******** Called once jQuery has loaded ******/
function scriptLoadHandler() {

    loadScript(app_url + "embed/libs/js/magnific-popup/jquery.magnific-popup.js", function(){
         loadScript("https://unpkg.com/masonry-layout@4.2.0/dist/masonry.pkgd.min.js", function(){
            loadScript(app_url + "libs/js/swiper/swiper.min.js", function(){
            // Restore $ and window.jQuery to their previous values and store the
            // new jQuery in our local jQuery variable
            $ = jQuery = window.jQuery.noConflict(true);

            // Call our main function
                main();
            });
        });
    });
 
}function loadScript(url, callback){

	/* Load script from url and calls callback once it's loaded */
	var scriptTag = document.createElement('script');
	scriptTag.setAttribute("type", "text/javascript");
	scriptTag.setAttribute("src", url);

	if (typeof callback !== "undefined") {
		if (scriptTag.readyState) {
			/* For old versions of IE */
			scriptTag.onreadystatechange = function(){
				if (this.readyState === 'complete' || this.readyState === 'loaded') {
					callback();
				}
			};
		} else {
			scriptTag.onload = callback;
		}
	}
	(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
}

// load css file
function loadCssFile(filename){

    var fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);

    if(typeof fileref!="undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }
}

function getDsmAppUrl(){

    // auto detect live and dev version
    var scripts = document.getElementsByTagName("script");
    var scripts_length=scripts.length;
    var search_result=-1;
    var app_url="";

    for(var i=0; i < scripts_length; i++){
        var src_str=scripts[i].getAttribute('src');

        if(src_str!=null){
          search_result=src_str.search("embed/google-reviews/widget");

          // app-dev found if greater than or equal to 1
          if(search_result>=1){ 
            var src_arr=src_str.split("embed/google-reviews/widget");
            app_url=src_arr[0];

            // replace if displaysocialmedia.com
            app_url = app_url.replace("displaysocialmedia.com", "sociablekit.com");
          }
        }
    }
    
    return app_url;
}

function getDsmEmbedId(sk_google_reviews){
    var embed_id = sk_google_reviews.attr('embed-id');
    if(embed_id==undefined){
        embed_id = sk_google_reviews.attr('data-embed-id');
    }

    return embed_id;
}

function getDsmSetting(sk_google_reviews, key){
    return sk_google_reviews.find("." + key).text();
}
function loadGoogleReviews(jQuery, sk_google_reviews){

    var embed_id=getDsmEmbedId(sk_google_reviews);
    var json_url=app_url + "embed/google-reviews/widget_reviews_json.php?embed_id=" + embed_id;
 
    // settings
    var show_load_more_button=sk_google_reviews.find('.show_load_more_button').text();
    var show_bottom_follow_button=sk_google_reviews.find('.show_bottom_follow_button').text();
    var show_average_rating=getDsmSetting(sk_google_reviews, "show_average_rating");
 
    // text settings
    var load_more_posts_text=sk_google_reviews.find('.load_more_posts_text').text();
    
    // get events
    
    fetch(json_url, { method: 'get' })
    .then(function(response) {
        response.json().then(function(data) {
            
            if(data.message=="load failed" || data.message=="No Data Found"){
                
                var sk_error_message = data.instructions;

                sk_google_reviews.find(".first_loading_animation").hide();
                sk_google_reviews.html(sk_error_message);
            }

            
            else{
                var post_items="";
                var view_more_on_google = sk_google_reviews.find('.custom_google_place_link').text().length > 0 ? sk_google_reviews.find('.custom_google_place_link').text() : data.bio.link;
     
                post_items+="<div class='' style='display:block;overflow:hidden;'>";
                    post_items+="<div class=' sk-ww-google-reviews-items'>";
                        post_items+="<div class='sk_fb_page_reviews_grid'>";
                            post_items+="<div class='sk_fb_page_reviews_grid-sizer'></div>";
                                if(show_average_rating==1){
                                    post_items+="<div class='sk_fb_page_reviews_grid-item '>";
                                         post_items+="<div class='sk_fb_page_reviews_grid-content' style='padding:0;'>";
                                             post_items+="<div class='sk_fb_reviews_badge'>";
                                                 post_items+="<a href='" + data.bio.link + "' target='_blank'>";
                                                     post_items+="<div class='sk_fb_reviews_num_icon'>";
                                                         post_items+= data.bio.overall_star_rating + " <i class='sk_fb_stars fa fa-star' aria-hidden='true'></i>";
                                                     post_items+="</div>";
             
                                                     post_items+="<div style='width:100%;'>";
                                                         post_items+="<div style='margin:5px 0;'>Google "+getDsmSetting(sk_google_reviews, "over_all_rating_text")+"</div>";
                                                         post_items+="<div style='margin:5px 0;font-weight:bold;'>" + getDsmSetting(sk_google_reviews, "short_name")+"</div>";
                                                         post_items+="<div style='margin:5px 0;'>" + data.bio.rating_count + " "+getDsmSetting(sk_google_reviews, "reviews_text")+"</div>";
                                                     post_items+="</div>";
                                                 post_items+="</a>";
                                             post_items+="</div>";
                                         post_items+="</div>";
                                    post_items+="</div>";
                                }
                                jQuery.each(data.reviews, function(key, val){
                                    post_items+="<div class='sk_fb_page_reviews_grid-item ' style='position:relative'>";
                                        post_items+=getFeedItem(val, sk_google_reviews, data.bio);
                                    post_items+="</div>"; // end sk_fb_page_reviews_grid-item
                                });
                            post_items+="</div>";
                        post_items+="</div>";
                        post_items+="<div class='sk-below-button-container'>";
                            if(show_load_more_button==1 && data.page_info.next_page_url != ""){
                                post_items+="<button class='sk-google-reviews-load-more-posts'>";
                                    post_items+=load_more_posts_text;
                                post_items+="</button>";
                            }
                            if(show_bottom_follow_button==1){
                                post_items+="<button class='sk-google-reviews-bottom-follow-btn ' onclick=\"window.open('" + view_more_on_google + "');\">";
                                    post_items+="<i class='fa fa-google' aria-hidden='true'></i> " + getDsmSetting(sk_google_reviews, "view_more_text");
                                post_items+="</button>";
                            }
                            post_items+="<div class='sk-google-reviews-next-page display-none'>" + data.page_info.next_page_url + "</div>";
                        post_items+="</div>";
                    post_items+="</div>";
                post_items+="</div>";

     
                post_items += getSociableKITBranding(sk_google_reviews, "Google reviews <i class='fa fa-bolt'></i> by SociableKIT", "google reviews");
     
                sk_google_reviews.append(post_items);
     
                // apply google data structure
                jQuery('head').append('<script type="application/ld+json">' + data.google_data_structure_json  + '</script>');
         
                applyCustomUi(jQuery, sk_google_reviews);
     
                applyMasonry();
                fixMasonry();
            }
        });
    })
    .catch(function(err) {
        console.log('GETTING DATA RETURN ERROR!');
        console.log(err);
    });
 
 }

function getFeedItem(val, sk_google_reviews, bio){

    var show_owners_response    = getDsmSetting(sk_google_reviews,"show_owners_response");
    var show_image          = getDsmSetting(sk_google_reviews,"show_image");
    var character_limit          = getDsmSetting(sk_google_reviews,"character_limit");
    var post_items="";

    var review_text = val.review_text;

    var review_text = character_limit == 0 ? review_text : review_text.substr(0, character_limit)+ (review_text.length <= character_limit ?"" : "...");

    var view_on_google = sk_google_reviews.find('.custom_google_place_link').text().length > 0 ? sk_google_reviews.find('.custom_google_place_link').text() : val.reviewer_link;

    post_items+="<div class='sk_fb_page_reviews_grid-content'>";
        post_items+="<div class='sk-ww-google-reviews-content review-list'>";
 
             post_items+="<div class='sk-ww-google-reviews-reviewer'>";
 
                 post_items+="<div class='sk-reviewer-pic'>";
                     post_items+="<img src='" + val.reviewer_photo_link + "' />";
                 post_items+="</div>"; // END sk-reviewer-pic
 
                 post_items+="<div class='sk-reviewer-name-action'>";
                     post_items+="<a style='word-wrap: break-word;' href='" + val.reviewer_contributor_link + "' target='_blank'><strong>" + val.reviewer_name + "</strong></a> ";
                     
                     
                     post_items+="<div class='sk_fb_date'>";
                         post_items+= val.review_date_time;
                     post_items+="</div>";
                 post_items+="</div>"; 
 
             post_items+="</div>";

             post_items+="<div class='google-reviews-item sk-ww-google-reviews-review-text'>";
                // stars
                post_items+="<span class='sk_fb_stars'>";
                    for(var count=1; count<=val.rating; count++){
                        post_items+=" <i class='fa fa-star' aria-hidden='true'></i>";
                    }
                post_items+="</span>";

                // review text
                post_items+= review_text;
             post_items+="</div>"; 

             if(val.owners_response && show_owners_response == 1){
                 post_items+="<div class='sk-ww-google-reviews-owners-response-text'>";
                     post_items+="<strong>" + getDsmSetting(sk_google_reviews, "response_text") + "</strong> " + val.owners_response;
                 post_items+="</div>"; 
             }
 
             if(val.reviewer_images_link && show_image == 1)
             {
                 post_items+="<div class='sk-ww-google-reviews-owners-response-image'>";
 
                     val.reviewer_images_link.forEach(function(element) {
                         post_items+="<a href='"+element+"' target='_blank'><img  src='" + element + "' class='media_link' /></a>";
                     });
                 post_items+="</div>"; // END sk-ww-google-reviews-review-image
             }

            post_items+="<a target='_blank' href='" + view_on_google + "' class='sk-google-review-button-more'>";
                post_items+="<img src='" + app_url + "images/google_icon20.png'/> ";
                post_items+="View on Google";
            post_items+="</a>";

        post_items+="</div>"; // END sk-ww-google-reviews-content
        
        //PUPUP
        post_items+="<div class='white-popup mfp-hide sk-review-popup'>";
 
             post_items+="<div class='sk-ww-google-reviews-reviewer'>";
 
                 post_items+="<div class='sk-reviewer-pic'>";
                     post_items+="<img src='" + val.reviewer_photo_link + "' />";
                 post_items+="</div>"; // END sk-reviewer-pic
 
                 post_items+="<div class='sk-reviewer-name-action'>";
                     post_items+="<a  style='word-wrap: break-word;' href='" + val.reviewer_contributor_link + "' target='_blank'><strong>" + val.reviewer_name + "</strong></a> ";
                     post_items+=getDsmSetting(sk_google_reviews, "reviewed_text") + " <a href='" + bio.link + "' target='_blank'>" + bio.name + "</a> ";
                     post_items+="<div class='sk_fb_stars'>";
                         for(var count=1; count<=val.rating; count++){
                             post_items+=" <i class='fa fa-star' aria-hidden='true'></i>";
                         }
                     post_items+="</div>"; // END sk_fb_stars
                     post_items+="<div class='sk_fb_date'>";
                         post_items+= "<a href='https://www.google.com/maps/contrib/" + val.contributor_id + "/place/" + val.google_place_id + "/' target='_blank'>" + val.review_date_time + "</a> ";
                     post_items+="</div>"; // END sk_fb_stars
                 post_items+="</div>"; // END sk-reviewer-name-action
 
             post_items+="</div>"; // END sk-ww-google-reviews-reviewer
 
             post_items+="<div class='sk-ww-google-reviews-review-text-popup'>";
                 post_items+= val.review_text_raw;
             post_items+="</div>"; // END sk-ww-google-reviews-review-text
             if(val.owners_response){
                 post_items+="<div class='sk-ww-google-reviews-owners-response-text-popup'>";
                     post_items+="<strong>" + getDsmSetting(sk_google_reviews, "response_text") + "</strong> " + val.owners_response;
                 post_items+="</div>"; // END sk-ww-google-reviews-review-text
             }
 
             if(val.reviewer_images_link)
             {
                 post_items+="<div class='sk-ww-google-reviews-owners-response-image'>";
                    val.reviewer_images_link.forEach(function(element) {
                         post_items+="<a href='"+element+"' target='_blank'><img  src='" + element + "' class='media_link' /></a>";
                     });
                 post_items+="</div>"; // END sk-ww-google-reviews-review-image
             }
             post_items+="<div class='sk-google-review-button-container' ><a target='_blank' href='"+val.reviewer_link+"' class='sk-google-review-button-more'><img src='"+app_url+"images/google_icon20.png'/> <span>View on Google</span></a></div>";
        post_items+="</div>"; // END sk-ww-google-reviews-content
        
    post_items+="</div>"; // END sk_fb_page_reviews_grid-content
 
    return post_items;
}
 
function applyMasonry(){
     $sk_fb_page_reviews_grid_holder = new Masonry('.sk_fb_page_reviews_grid',{
         itemSelector: '.sk_fb_page_reviews_grid-item',
         columnWidth: '.sk_fb_page_reviews_grid-sizer',
         percentPosition: true,
         transitionDuration: 0
     });

     var sk_google_reviews = $(".sk-ww-google-reviews");

     if(getDsmSetting(sk_google_reviews, "layout") == 3){
        // skLayoutSliderAutoplayHeight(sk_google_reviews);
     }
 }
 
 function fixMasonry(){
 
     setTimeout(
         function() {
             applyMasonry();
         }, 500);
 
     setTimeout(
         function() {
             applyMasonry();
         }, 1000);
 
     // make sure
     setTimeout(
         function() {
             applyMasonry();
         }, 2000);
 
     setTimeout(
         function() {
             applyMasonry();
         }, 3000);
 
     setTimeout(
         function() {
             applyMasonry();
         }, 4000);
 
     setTimeout(
         function() {
             applyMasonry();
         }, 5000);
 
     setTimeout(
         function() {
             applyMasonry();
         }, 6000);
 
     setTimeout(
         function() {
             applyMasonry();
         }, 7000);
 
     setTimeout(
         function() {
             applyMasonry();
         }, 8000);
 }function loadGoogleReviewsForSliderLayout(jQuery, sk_google_reviews){

    var embed_id=getDsmEmbedId(sk_google_reviews);
    var json_url=app_url + "embed/google-reviews/widget_reviews_json.php?embed_id=" + embed_id;
 
    var show_load_more_button=sk_google_reviews.find('.show_load_more_button').text();
    var show_bottom_follow_button=sk_google_reviews.find('.show_bottom_follow_button').text();
    var show_average_rating=getDsmSetting(sk_google_reviews, "show_average_rating");
 
    // text settings
    var load_more_posts_text=sk_google_reviews.find('.load_more_posts_text').text();


    fetch(json_url, { method: 'get' })
    .then(function(response) {
        response.json().then(function(data) {
            
            if(data.message=="load failed" || data.message=="No Data Found"){
                
                var sk_error_message = data.instructions;

                sk_google_reviews.find(".first_loading_animation").hide();
                sk_google_reviews.html(sk_error_message);
            }
            else{
                var post_items="";
                    post_items+="<div class='sk-google-all-reviews'>";
                        if(data.reviews.length>0){
                                post_items+=  "<div id='sk_google_reviews_slider' class='swiper-container swiper-layout-slider'>";
                                    post_items+=  "<div class='swiper-wrapper'>";
                                        post_items+="<div class='swiper-slide'>";
                                            post_items+="<div class='sk_fb_page_reviews_grid'>";
                                                post_items+="<div class='sk_fb_page_reviews_grid-sizer'></div>";
                                                if(show_average_rating==1){
                                                     post_items+="<div class='sk_fb_page_reviews_grid-item'>";
                                                         post_items+="<div class='sk_fb_page_reviews_grid-content' style='padding:0;'>";
                                                             post_items+="<div class='sk_fb_reviews_badge'>";
                                                                 post_items+="<a href='" + data.bio.link + "' target='_blank'>";
                                                                     post_items+="<div class='sk_fb_reviews_num_icon'>";
                                                                         post_items+= data.bio.overall_star_rating + " <i class='fa fa-star sk_fb_stars' aria-hidden='true'></i>";
                                                                     post_items+="</div>";

                                                                     post_items+="<div style='width:100%;'>";
                                                                         post_items+="<div style='margin:5px 0;'><i class='fa fa-google' aria-hidden='true' style='color:#5b93fc;'></i> "+getDsmSetting(sk_google_reviews, "over_all_rating_text")+"</div>";
                                                                         post_items+="<div style='margin:5px 0;font-weight:bold;'>" + getDsmSetting(sk_google_reviews, "short_name")+"</div>";
                                                                         post_items+="<div style='margin:5px 0;'>" + data.bio.rating_count + " "+getDsmSetting(sk_google_reviews, "reviews_text")+"</div>";
                                                                     post_items+="</div>";
                                                                 post_items+="</a>";
                                                             post_items+="</div>";
                                                         post_items+="</div>";
                                                     post_items+="</div>";
                                                }
                                                jQuery.each(data.reviews, function(key, val){
                                                    post_items+="<div class='sk_fb_page_reviews_grid-item'>";
                                                         post_items+=getFeedItem(val, sk_google_reviews, data.bio);
                                                     post_items+="</div>"; // end sk_fb_page_reviews_grid-item
                                                });
                                            post_items+="</div>";
                                        post_items += "</div>";

                                        //for autoplay 
                                        if(data.page_info.next_page_url!="" && getDsmSetting(sk_google_reviews, "autoplay") == 1){
                                            for(var i = 2; i <= data.page_info.pages ; i++){
                                                var base_url = data.page_info.base_url + i;
                                                post_items += "<div class='swiper-slide slide-page-"+i+"'>";
                                                        getAutoplaySlider(sk_google_reviews,base_url);
                                                post_items+="</div>";
                                            }
                                        }
                                    post_items+=  "</div>";
                                    if(data.page_info.next_page_url){
                                        post_items+="<button type='button' class='swiper-button-next ' style='pointer-events: all;'>";
                                            post_items+="<i class='fa fa-chevron-circle-right swiper-next-arrow' aria-hidden='true'></i>";
                                        post_items+="</button>";
                                        post_items+="<button type='button' class='swiper-button-next-trigger display-none' style='pointer-events: all;'>";
                                            post_items+="<i class='fa fa-chevron-circle-right swiper-next-arrow' aria-hidden='true'></i>";
                                        post_items+="</button>";
                                        post_items+="<button type='button' class='swiper-button-prev' style='pointer-events: all;'>";
                                            post_items+="<i class='fa fa-chevron-circle-left swiper-prev-arrow' aria-hidden='true'></i>";
                                        post_items+="</button>";
                                    
                                    }
                                    
                                post_items+=  "</div>";    
                        }
                    post_items+="</div>";
                post_items+="<div class='sk-google-reviews-next-page display-none'>" + data.page_info.next_page_url + "</div>";

                sk_google_reviews.append(post_items);
              
              
                if(getDsmSetting(sk_google_reviews, "autoplay") == 0){
                    skSliderLayoutSettings(sk_google_reviews);
                }
                applyCustomUi(jQuery, sk_google_reviews);
            }
        });
    })
    .catch(function(err) {
        console.log('GETTING DATA RETURN ERROR!');
        console.log(err);
    });
}

function getAutoplaySlider(sk_google_reviews,base_url){
    var count_swiper = sk_google_reviews.find('.swiper-slide-active').length;
    var json_url = base_url;
    
    fetch(json_url, { method: 'get' })
    .then(function(response) {
        response.json().then(function(data) {
            
            var post_items = "";
            post_items+="<div class='sk_fb_page_reviews_grid'>";
                post_items+="<div class='sk_fb_page_reviews_grid-sizer'></div>";
                jQuery.each(data.reviews, function(key, val){
                    post_items+="<div class='sk_fb_page_reviews_grid-item'>";
                        post_items+=getFeedItem(val, sk_google_reviews, data.bio);
                    post_items+="</div>"; // end sk_fb_page_reviews_grid-item
                 });
            post_items+="</div>";

            sk_google_reviews.find('.slide-page-'+data.page_info.current_page).html(post_items);
            applyCustomUi(jQuery, sk_google_reviews);
            
            if(count_swiper == 0){
                skSliderLayoutSettings(sk_google_reviews);
            }  
        });
    })
    .catch(function(err) {
        console.log('GETTING DATA RETURN ERROR!');
        console.log(err);
    });
}

function skSliderLayoutSettings(sk_google_reviews){
    if(getDsmSetting(sk_google_reviews, "autoplay") == 1){
            var delay = getDsmSetting(sk_google_reviews, "delay") * 1000;
            var swiper = new Swiper('.swiper-layout-slider.swiper-container', {
                loop: true,
                autoplay: {
                    delay: delay,
                },
                navigation: {
                    nextEl: '.swiper-button-next-trigger',
                    prevEl: '.swiper-button-prev',
                },

            });
            swiper.on('slideChange',function (event) {
                skLayoutSliderArrowUI(sk_google_reviews);
            });
        }
        else{
            var swiper = new Swiper('.swiper-layout-slider.swiper-container', {
                navigation: {
                    nextEl: '.swiper-button-next-trigger',
                    prevEl: '.swiper-button-prev',
                },
               
            });
        }

    sk_google_reviews.find('.swiper-button-next').click({swiper:swiper,sk_google_reviews:sk_google_reviews},skSliderLayoutNextClickEvent);
    sk_google_reviews.find('.swiper-button-prev').click({sk_google_reviews:sk_google_reviews},skSliderLayoutPrevClickEvent);
}
function skSliderLayoutNextClickEvent(event){

    var sk_google_reviews = event.data.sk_google_reviews;
    var swiper = event.data.swiper;
     
    var next_page=sk_google_reviews.find('.sk-google-reviews-next-page').text();
        
    var json_url=next_page;
    var next_btn = jQuery(this);
    var current_icon = next_btn.html();
        next_btn.html("<i class='fa fa-spinner fa-pulse swiper-button-spinner' aria-hidden='true'></i>");
    var text = sk_google_reviews.find(".swiper-layout-slider .swiper-slide-next").text(); 
    if(text == "" && next_page !=""){ 
        fetch(json_url, { method: 'get' })
        .then(function(response) {
            response.json().then(function(data) {
                
                var post_items = "";
            
                    post_items+="<div class='sk_fb_page_reviews_grid'>";
                        post_items+="<div class='sk_fb_page_reviews_grid-sizer'></div>";
                        jQuery.each(data.reviews, function(key, val){
                            post_items+="<div class='sk_fb_page_reviews_grid-item'>";
                                post_items+=getFeedItem(val, sk_google_reviews, data.bio);
                            post_items+="</div>"; // end sk_fb_page_reviews_grid-item
                         });
                    post_items+="</div>";
                
                
                event.preventDefault();
                swiper.appendSlide('<div class="swiper-slide swiper-slide-next"></div>');
                sk_google_reviews.find('.swiper-slide-next').html(post_items);
                next_btn.html(current_icon);
                
                sk_google_reviews.find('.sk-google-reviews-next-page').text(data.page_info.next_page_url);
                sk_google_reviews.find('.swiper-button-next-trigger').removeClass('swiper-button-disabled').removeAttr('aria-disabled');
                sk_google_reviews.find('.swiper-button-next-trigger').click();
                if(data.page_info.next_page_url == ""){
                    sk_google_reviews.find('.swiper-layout-slider .swiper-button-next').css('visibility','hidden')
                }
                applyCustomUi(jQuery, sk_google_reviews);
            });
        })
        .catch(function(err) {
            console.log('GETTING DATA RETURN ERROR!');
            console.log(err);
        });
    }
    else
    {
        sk_google_reviews.find('.swiper-button-next-trigger').click();
        clickEventSlider(sk_google_reviews);
        next_btn.html(current_icon);
    }
}

function skSliderLayoutPrevClickEvent(event)
{
    clickEventSlider(event.data.sk_google_reviews);
   event.data.sk_google_reviews.find('.swiper-button-next').html("<i class='fa fa-chevron-circle-right swiper-next-arrow' aria-hidden='true'></i>");
}
function clickEventSlider(sk_google_reviews)
{   
    var next_page=sk_google_reviews.find('.sk-google-reviews-next-page').text();
    var next_slide=sk_google_reviews.find('.swiper-slide-next').text();
    if(next_page == "" && next_slide == ""){
        sk_google_reviews.find('.swiper-layout-slider .swiper-button-next').css('visibility','hidden')
    }
    else{
        sk_google_reviews.find('.swiper-layout-slider .swiper-button-next').css('visibility','visible')
    }
    skLayoutSliderArrowUI(sk_google_reviews);
}


function skLayoutSliderArrowUI(sk_google_reviews){
    var arrow_background_color = getDsmSetting(sk_google_reviews, "arrow_background_color");
    var arrow_color = getDsmSetting(sk_google_reviews, "arrow_color");
    var arrow_opacity = getDsmSetting(sk_google_reviews, "arrow_opacity");

    // Apply Opacity
    jQuery(".swiper-button-next,.swiper-button-prev")
        .mouseover(function(){
            jQuery(this).css({
              "opacity":"1"
            });

        }).mouseout(function(){
            jQuery(this).css({
              "opacity":arrow_opacity
            });
    });
    // Get the height
    var feed_h = sk_google_reviews.find('.swiper-slide-active .sk_fb_page_reviews_grid').innerHeight();
    if(feed_h == null){
        feed_h = sk_google_reviews.find('.sk_fb_page_reviews_grid').innerHeight();
    }
    
    // Solution for image cutting
    sk_google_reviews.find(".swiper-wrapper,.swiper-slide,#sk_google_reviews_slider").css({
        "height":feed_h + 20  +"px"
    });

    sk_google_reviews.css("width","100%"); 
    
    // position button to center
    var feed_h_2 = feed_h / 2;
    sk_google_reviews.find(".swiper-button-prev,.swiper-button-next").css({
        "top":feed_h_2 +"px",
        "background-color": arrow_color,
        "opacity":arrow_opacity,
        "color":arrow_background_color 
    });

    fixMasonry();
}
function hidePopUp(){
    if(jQuery.magnificPopup){
      jQuery.magnificPopup.close();
    }
}

function showPopUp(jQuery, content_src, clicked_element){

    jQuery('.sk_selected_reviews').removeClass('sk_selected_reviews');
    jQuery('.prev_sk_google_review').remove();
    jQuery('.next_sk_google_review').remove();
    clicked_element.addClass('sk_selected_reviews');
    hidePopUp();
    
    if(typeof jQuery.magnificPopup === "undefined")
        initManificPopupPlugin(jQuery);
        
    jQuery.magnificPopup.open({
        items: { src: content_src },
        'type' : 'inline',
        closeOnBgClick : true,
        callbacks: {
            open: function() { 
                jQuery('.mfp-container').css({ 'top' : 0 });
                jQuery('.mfp-content').css({ 'vertical-align' : 'inherit' });
                jQuery('.mfp-content a').css({ 'text-decoration' : 'none' });

                var post_html="";
                if(clicked_element.prev('.sk_fb_page_reviews_grid-item').length > 0 && clicked_element.prev('.sk_fb_page_reviews_grid-item').find('.sk-review-popup').length >0){
                    post_html+="<button class='prev_sk_google_review'>";
                        post_html+="<i class='fa fa-chevron-left sk_prt_4px' aria-hidden='true'></i>";
                    post_html+="</button>";
                }

                if(clicked_element.next().length > 0){
                    post_html+="<button class='next_sk_google_review'>";
                        post_html+="<i class='fa fa-chevron-right sk_plt_4px' aria-hidden='true'></i>";
                    post_html+="</button>";
                }

                jQuery('.sk-review-popup').prepend(post_html);

            },
            close: function() {
                hidePopUp();
            }
        }
    });
}
// make widget responsive
function makeResponsive(jQuery, sk_google_reviews){

    var sk_google_reviews_width = sk_google_reviews.width();
    var grid_sizer_item = 33;
 
    /* smartphones, iPhone, portrait 480x320 phones */
    if(sk_google_reviews_width<=320){ grid_sizer_item=100; }
 
    /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
    else if(sk_google_reviews_width<=481){ grid_sizer_item=100; }
 
    /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
      else if(sk_google_reviews_width<=641){ grid_sizer_item=50; }
 
    /* tablet, landscape iPad, lo-res laptops ands desktops */
    else if(sk_google_reviews_width<=930){
        if(getDsmSetting(sk_google_reviews, "column_count")==1){ grid_sizer_item=100; }
        else if(getDsmSetting(sk_google_reviews, "column_count")==2){ grid_sizer_item=50; }
        else{ grid_sizer_item=33 }
    }
 
    // follow the setting
    else{
        if(getDsmSetting(sk_google_reviews, "column_count")==1){ grid_sizer_item=100; }
        else if(getDsmSetting(sk_google_reviews, "column_count")==2){ grid_sizer_item=50; }
        else if(getDsmSetting(sk_google_reviews, "column_count")==3){ grid_sizer_item=33; }
        else if(getDsmSetting(sk_google_reviews, "column_count")==4){ grid_sizer_item=25; }
        else if(getDsmSetting(sk_google_reviews, "column_count")==5){ grid_sizer_item=20; }
        else if(getDsmSetting(sk_google_reviews, "column_count")==6){ grid_sizer_item=16.6; }
    }
    
 
    sk_google_reviews.find(".sk_fb_page_reviews_grid-sizer,.sk_fb_page_reviews_grid-item").css({
        "width" : grid_sizer_item + "%"
    });
    // set event height for slider and grid layout

    if(getDsmSetting(sk_google_reviews,'layout')==1 || getDsmSetting(sk_google_reviews,'layout')==3){
        if(getDsmSetting(sk_google_reviews, "show_image") == 1){

            var imgs = sk_google_reviews.find('img');
            var len = imgs.length;
            if(len == 0 || imgs.prop('complete')){
                setEventFeedHeight(sk_google_reviews); 
            }
            
            var counter = 0;
            [].forEach.call( imgs, function( img ) {
                img.addEventListener( 'load', function() {
                    counter++;
                    if ( counter == len ) {
                        setEventFeedHeight(sk_google_reviews);
                    }
                }, false );
            });
        }
        else{
            setEventFeedHeight(sk_google_reviews);
        }
        
    }
}

function setEventFeedHeight(sk_google_reviews){

    if(getDsmSetting(sk_google_reviews,'layout') == 1){
    
        var thisH = 0;
        var maxHeight = 0;
        

        sk_google_reviews.find(".sk_fb_page_reviews_grid-item ").each(function(){

            thisH = jQuery(this).height();
            if (thisH > maxHeight) { maxHeight = thisH; }
        });
        sk_google_reviews.find(".sk_fb_reviews_badge,.google-reviews-item").css({
            "height" : maxHeight + "px"
        });

        sk_google_reviews.find(".sk-ww-google-reviews-content").each(function(){

            thisH = jQuery(this).height();
            if (thisH > maxHeight) { maxHeight = thisH; }
        });

        maxHeight = maxHeight + 20;
        
        sk_google_reviews.find(".sk_fb_reviews_badge,.google-reviews-item").css({
            "height" : maxHeight + "px"
        });







        var maxHeight_2 = maxHeight / 2;
        var maxHeight_3 = maxHeight_2 / 3;
        sk_google_reviews.find(".sk_fb_reviews_num_icon").css({
            "height" : maxHeight_2 + "px",
            "line-height" : maxHeight_2 + "px",
        });
        
        applyMasonry();
        fixMasonry();
    }
    

 }function applyCustomUi(jQuery, sk_google_reviews){

     // hide 'loading animation' image
     sk_google_reviews.find(".loading-img").hide();
     sk_google_reviews.find(".first_loading_animation").hide();
 
     // container width
     sk_google_reviews.css({ 'width' : '100%' });
     
        var sk_google_reviews_width=sk_google_reviews.outerWidth(true).toFixed(2);
     // change height to normal
     sk_google_reviews.css({'height' : 'auto'});
 
     // identify column count
     var column_count=sk_google_reviews.find('.column_count').text();
      if(
         /* smartphones, iPhone, portrait 480x320 phones */
         sk_google_reviews_width<=320 ||
 
          /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
          sk_google_reviews_width<=481 ||
 
          /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
          sk_google_reviews_width<=641
     ){
         column_count=2;
      }
     // size settings
     var border_size=0;
     var background_color="#555555";

     var space_between_images=parseFloat(sk_google_reviews.find('.space_between_images').text());
    var margin_between_images=parseFloat(parseFloat(space_between_images).toFixed(0) / 2) - parseFloat(1);

    var total_space_between_images=(parseFloat(space_between_images).toFixed(2)*parseFloat(column_count)) + parseFloat(space_between_images);
    var pic_width=(parseFloat(sk_google_reviews_width).toFixed(0)-parseFloat(total_space_between_images).toFixed(0)) / parseFloat(column_count).toFixed(0);
    

    // container width
    sk_google_reviews.css({ 'width' : '100%' });
    // var sk_google_reviews_width=sk_google_reviews.innerWidth();
    var sk_google_reviews_width=sk_google_reviews.outerWidth(true).toFixed(2);

    // change height to normal
    sk_google_reviews.css({'height' : 'auto'});

    var column_count=sk_google_reviews.find('.column_count').text();

    // size settings
    var border_size=0;
    var background_color="#555555";
    var space_between_images=parseFloat(sk_google_reviews.find('.space_between_images').text());
    var margin_between_images=parseFloat(parseFloat(space_between_images).toFixed(0) / 2) - parseFloat(1);

    var total_space_between_images=(parseFloat(space_between_images).toFixed(2)*parseFloat(column_count)) + parseFloat(space_between_images);
    var pic_width=(parseFloat(sk_google_reviews_width).toFixed(0)-parseFloat(total_space_between_images).toFixed(0)) / parseFloat(column_count).toFixed(0);




    // font & color settings
     var font_family=sk_google_reviews.find('.font_family').text();
     var details_bg_color=sk_google_reviews.find('.details_bg_color').text();
     var details_font_color=sk_google_reviews.find('.details_font_color').text();
     var details_link_color=sk_google_reviews.find('.details_link_color').text();
     var details_link_hover_color=sk_google_reviews.find('.details_link_hover_color').text();
     var bold_font_color=sk_google_reviews.find('.bold_font_color').text();
     var item_bg_color=sk_google_reviews.find('.item_bg_color').text();
     var item_font_color=sk_google_reviews.find('.item_font_color').text();
     var badge_bg_color=sk_google_reviews.find('.badge_bg_color').text();
     var badge_font_color=sk_google_reviews.find('.badge_font_color').text();
     var button_bg_color=sk_google_reviews.find('.button_bg_color').text();
     var button_text_color=sk_google_reviews.find('.button_text_color').text();
     var button_hover_bg_color=sk_google_reviews.find('.button_hover_bg_color').text();
     var button_hover_text_color=sk_google_reviews.find('.button_hover_text_color').text();
 
 
     // apply font family
     sk_google_reviews.css({
         'font-family' : font_family,
         'background-color' : details_bg_color,
         'width' : sk_google_reviews_width
     });
 
     // pop up settings
     jQuery('.sk-pop-google-videos-post').css({
         'font-family' : font_family
     });
 
     // details
     sk_google_reviews.find('.google-videos-user-root-container').css({
         'color' : details_font_color
     });
 
     // details link
     sk_google_reviews.find('.google-videos-user-root-container a, .sk-ww-google-reviews-content a').css({
         'color' : details_link_color
     });
 
     sk_google_reviews.find(".google-videos-user-root-container a, .sk-ww-google-reviews-content a").mouseover(function() {
         $(this).css({'color' : details_link_hover_color});
     }).mouseout(function() {
         $(this).css({'color' : details_link_color});
     });
 
     sk_google_reviews.find(".sk_fb_reviews_badge a").mouseover(function() {
         $(this).css({'color' : details_link_hover_color});
     }).mouseout(function() {
         $(this).css({'color' : getDsmSetting(sk_google_reviews, "item_font_color")});
     });
 
     // bold_font_color
     sk_google_reviews.find('.sk-ww-google-reviews-owners-response-text strong').css({
         'color' : bold_font_color
     });
 
     sk_google_reviews.find('.sk-ww-google-reviews-review-text, .sk-ww-google-reviews-owners-response-text, .sk-ww-google-reviews-content label').css({
         'color' : item_font_color,
     });

     sk_google_reviews.find('.sk-review-popup').css({
         'color' : item_font_color,
         'font-family' : font_family
     });

     
 
     // details_font_size
     sk_google_reviews.find('.sk-ww-google-reviews-review-text, .sk-ww-google-reviews-owners-response-text, .sk-ww-google-reviews-reviewer, .sk_fb_reviews_badge').css({
         'font-size': getDsmSetting(sk_google_reviews, "details_font_size") + "px"
     });
 
     // details_all_caps
     if(getDsmSetting(sk_google_reviews, "details_all_caps")==1){
         // convert all to upper case if 1
         sk_google_reviews.find('.sk-ww-google-reviews-review-text, .sk-ww-google-reviews-owners-response-text, .sk-ww-google-reviews-reviewer, .sk_fb_reviews_badge').css({
             'text-transform': 'uppercase'
         });
     }
 
     
 
     // item_content_padding
     sk_google_reviews.find(".sk-ww-google-reviews-content").css({
         'padding' : getDsmSetting(sk_google_reviews, "item_content_padding") + "px"
     });

     sk_google_reviews.find(".sk-ww-google-reviews-review-text").css({
         'padding-bottom' : getDsmSetting(sk_google_reviews, "item_content_padding") + "px"
     });

     sk_google_reviews.find('.sk-ww-google-reviews-owners-response-image').css({
         'padding-bottom' : getDsmSetting(sk_google_reviews, "item_content_padding") + "px"
     });
 
     // badge_bg_color
     sk_google_reviews.find('.sk_fb_reviews_num_icon').css({
         'background-color' : badge_bg_color,
         'color' : badge_font_color,
     });
 
     // badge_bg_color - border
     sk_google_reviews.find('.sk_fb_reviews_badge').css({
         'border-color' : badge_bg_color,
     });
 
     // buttons
     var margin_bottom_sk_ig_load_more_posts=space_between_images;
     if(margin_bottom_sk_ig_load_more_posts==0){
         margin_bottom_sk_ig_load_more_posts=5;
     }
     sk_google_reviews.find(".sk-google-reviews-load-more-posts").css({
         'margin-bottom' : margin_bottom_sk_ig_load_more_posts + 'px'
     });
     
    sk_google_reviews.find(".sk-below-button-container").css({
        "display": "block",
        "overflow": "hidden",
        "margin": "0",
        "padding": "4.5px",
    });
     sk_google_reviews.find(".google-videos-user-container, .sk-google-reviews-load-more-posts, .sk-google-reviews-bottom-follow-btn")
         .css({
             'background-color' : button_bg_color,
             'border-color' : button_bg_color,
             'color' : button_text_color
         });
 
     sk_google_reviews.find(".google-videos-user-container, .sk-google-reviews-load-more-posts, .sk-google-reviews-bottom-follow-btn")
         .mouseover(function(){
             $(this).css({
                 'background-color' : button_hover_bg_color,
                 'border-color' : button_hover_bg_color,
                 'color' : button_hover_text_color
             });
         }).mouseout(function(){
             $(this).css({
                 'background-color' : button_bg_color,
                 'border-color' : button_bg_color,
                 'color' : button_text_color
             });
         });
 
     // bottom buttons container
     var padding_sk_ig_bottom_btn_container=margin_between_images;
     if(padding_sk_ig_bottom_btn_container==0){
         padding_sk_ig_bottom_btn_container=5;
     }
     sk_google_reviews.find(".sk-google-reviews-bottom-btn-container").css({
         'padding' : padding_sk_ig_bottom_btn_container + 'px'
     });
 
     sk_google_reviews.find(".sk_fb_stars").css({
         'color' : getDsmSetting(sk_google_reviews, "star_color")
     });
 
     sk_google_reviews.find('.sk_fb_reviews_badge a').css({
         'color' : getDsmSetting(sk_google_reviews, "item_font_color")
     });
 
     sk_google_reviews.find(".sk_fb_page_reviews_grid-content, .sk_fb_reviews_badge").css({
         'background-color' : item_bg_color,
         'color' : getDsmSetting(sk_google_reviews, "item_font_color"),
         'border-radius' : getDsmSetting(sk_google_reviews, "item_border_radius") + "px"
     });

     sk_google_reviews.find(".sk_fb_page_reviews_grid-item").css({
         'cursor' : 'pointer'
     });
 
     makeResponsive(jQuery, sk_google_reviews);
 
     // if one column layout
     if(getDsmSetting(sk_google_reviews, "one_column_layout")==1){
         sk_google_reviews.find(".sk_fb_page_reviews_grid-item").css({
             'width' : '100%'
         });
     }

     // if three column layout
     if(getDsmSetting(sk_google_reviews, "layout") == 3){
        skLayoutSliderArrowUI(sk_google_reviews);
     }
 
     // watermark css
         jQuery('.sk_powered_by a').css({
             'background-color' : getDsmSetting(sk_google_reviews, "details_bg_color"),
             'color' : getDsmSetting(sk_google_reviews, "details_font_color"),
             'font-size' : getDsmSetting(sk_google_reviews, "details_font_size"),
         });
         sk_google_reviews.find('.sk_powered_by').css({ 'margin-bottom' : space_between_images + 'px' });
 
 
     // apply custom css
    jQuery('head').append('<style type="text/css">' + getDsmSetting(sk_google_reviews, "custom_css")  + '</style>');
    

    apply100PercentWidth(sk_google_reviews,sk_google_reviews_width);

    setEventFeedHeight(sk_google_reviews);
    
 }


function apply100PercentWidth(sk_google_reviews,sk_google_reviews_width)
 {
    var grid_item = sk_google_reviews.find('.sk_fb_page_reviews_grid-item');
    var length    = grid_item.length;
    

    if(length > 1){
        sk_google_reviews.find(".sk-below-button-container").css({
         'width' : (sk_google_reviews_width > 640 ? sk_google_reviews_width -11 : sk_google_reviews_width)  +"px",
        });
    }
    if(length == 1)
    {
      grid_item.css('width','100%');
    }
 }
function setCookieSameSite(){
    document.cookie = "AC-C=ac-c;expires=Fri, 31 Dec 2025 23:59:59 GMT;path=/;HttpOnly;SameSite=Lax";
}

setCookieSameSite();

function getIEVersion() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");

    // If IE, return version number.
    if (Idx > 0) 
    return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));

    // If IE 11 then look for Updated user agent string.
    else if (!!navigator.userAgent.match(/Trident\/7\./)) 
        return 11;
    else
    return 0; //It is not IE
}

function isSafariBrowser() {
    var ua = navigator.userAgent.toLowerCase(); 
    if (ua.indexOf('safari') != -1) { 
        if (ua.indexOf('chrome') > -1) {
            return 0; // Chrome
        } else {
            return 1; // Safari
        }
    }
}

if(getIEVersion() > 0 || isSafariBrowser() > 0) {
    /* Load script from url and calls callback once it's loaded */
    loadIEScript('https://cdn.jsdelivr.net/bluebird/3.5.0/bluebird.min.js');
    loadIEScript('https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js');
}

function loadIEScript(url){

    /* Load script from url and calls callback once it's loaded */
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", url);
    
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
}

function updateUserViews(app_url,embed_id){

    // update views
    var update_views_url = app_url + "embed/update_views.php?embed_id=" + embed_id;
    fetch(update_views_url, { method: 'get' })
    .then(function(response) {
        response.json().then(function(data) {
            // console.log(data)
        });
    })
    .catch(function(err) {
        console.log('UPDATE VIEWS ERROR');
        console.log(err);
    });
}

function getSociableKITBranding(sk_, label, tutorial_link){
    var html="";
    if(getDsmSetting(sk_, "show_sociablekit_branding")=="1"){
        var fontFamily = getDsmSetting(sk_, "font_family");
        var link_color = getDsmSetting(sk_, "details_link_color");
        html += "<div class='sk_branding' style='padding:10px; display:block; text-align:center; text-decoration:underline; color:#555; font-family:"+fontFamily+"; font-size:15px;'>";
            html += "<a href='"+getTutorialLink(tutorial_link)+"' target='_blank' style='text-underline-position:under; color:"+link_color+";' title='Powered by SociableKIT'>";
                html += label;
            html += "</a>";
        html += "</div>";
    }
    return html;
}

function linkify(html) {
    var exp = /((href|src)=["']|)(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return html.replace(exp, function() {
      return  arguments[1] ? 
              arguments[0] : 
              "<a href=\"" + arguments[3] + "\">" + arguments[3] + "</a>"
    });
}

function getTutorialLink(listFunction){
    if(listFunction == "facebook page videos"){
        return "https://www.sociablekit.com/embed-facebook-page-videos-on-website/";
    }
    else if(listFunction == "private instagram feed"){
        return "https://www.sociablekit.com/embed-private-instagram-feed-on-website/";
    }
    else if(listFunction == "facebook one photo album"){
        return "https://www.sociablekit.com/embed-facebook-page-photo-album-on-website/";
    }
    else if(listFunction == "facebook photo albums"){
        return "https://www.sociablekit.com/embed-facebook-page-photo-albums-on-website/";
    }
    else if(listFunction == "instagram feed"){
        return "https://www.sociablekit.com/embed-instagram-feed-on-website/";
    }
    else if(listFunction == "facebook page events"){
        return "https://www.sociablekit.com/embed-facebook-page-events-on-website/";
    }
    else if(listFunction == "facebook page post"){
        return "https://www.sociablekit.com/embed-facebook-page-posts-on-website/";
    }
    else if(listFunction == "facebook page videos(one video)"){
        return "https://www.sociablekit.com/embed-facebook-page-video-on-website/";
    }
    else if(listFunction == "facebook page live video"){
        return "https://www.sociablekit.com/embed-facebook-page-live-video-on-website/";
    }
    else if(listFunction == "twitter feed"){
        return "https://www.sociablekit.com/embed-twitter-feed-on-website/";
    }
    else if(listFunction == "google reviews"){
        return "https://www.sociablekit.com/how-to-embed-google-reviews-on-website/";
    }
    else if(listFunction == "twitter hashtag feed"){
        return "https://www.sociablekit.com/embed-twitter-hashtag-feed-on-website/";
    }
    else if(listFunction == "facebook page event (one event)"){
        return "https://www.sociablekit.com/embed-facebook-page-event-on-website/";
    }
    else if(listFunction == "google calendar"){
        return "https://www.sociablekit.com/customize-embed-google-calendar-on-website/";
    }
    else if(listFunction == "medium publication feed"){
        return "https://www.sociablekit.com/embed-medium-publication-feed-on-website/";
    }
    else if(listFunction == "youtube channel"){
        return "https://www.sociablekit.com/embed-youtube-channel-on-website/";
    }
    else if(listFunction == "youtube playlist"){
        return "https://www.sociablekit.com/embed-youtube-playlist-on-website/";
    }
    else if(listFunction == "instagram hashtag feed"){
        return "https://www.sociablekit.com/embed-instagram-hashtag-feed-on-website/";
    }

    else if(listFunction == "facebook page reviews"){
        return "https://www.sociablekit.com/embed-facebook-page-reviews-on-website/";
    }
    else if(listFunction == "Medium Post"){
        return "https://www.sociablekit.com/customize-embed-medium-post-on-website/";
    }

    else if(listFunction == "youtube live video"){
        return "https://www.sociablekit.com/embed-youtube-channel-live-video-on-website/";
    }
    else if(listFunction == "linkedin profile post"){
        return "https://www.sociablekit.com/embed-linkedin-profile-posts-on-website/";
    }
    else if(listFunction == "linkedin page post"){
        return "https://www.sociablekit.com/embed-linkedin-page-posts-on-website/";
    }
    else {
        return "https://www.sociablekit.com/";
    }
}

// our main function
function main(){

     // manipulate page using jQuery
     jQuery(document).ready(function($) {
 
         jQuery('.sk-ww-google-reviews').each(function() {
            // know what to show
            var sk_google_reviews=jQuery(this);
 
            // get embed id
            var embed_id=getDsmEmbedId(sk_google_reviews);

            // update views - custom_script.php
            updateUserViews(app_url,embed_id);

            // change height to be more than current window
            var new_sk_google_reviews_height=jQuery(window).height() + 100;
            sk_google_reviews.height(new_sk_google_reviews_height);
 
            // get settings
            var json_url=app_url + "embed/google-reviews/widget_settings_json.php?embed_id=" + embed_id;
 
            fetch(json_url, { method: 'get' })
            .then(function(response) {
                response.json().then(function(data) {
                    
                    // load google font
                    var web_safe_fonts = [
                        "Inherit", "Impact, Charcoal, sans-serif", "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                        "Century Gothic, sans-serif", "'Lucida Sans Unicode', 'Lucida Grande', sans-serif", "Verdana, Geneva, sans-serif",
                        "Copperplate, 'Copperplate Gothic Light', fantasy", "'Courier New', Courier, monospace", "Georgia, Serif"
                    ];
 
                    var is_font_included = web_safe_fonts.indexOf(data.font_family);
                    if(is_font_included<0){ loadCssFile("https://fonts.googleapis.com/css?family=" + data.font_family); }
                 
                    if(data.show_feed==false){
 
                        sk_google_reviews.find('.loading-img').hide();
                        sk_google_reviews.find('.first_loading_animation').hide();
                        sk_google_reviews.prepend(data.message);
                    }
 
                    else{
 
                        // save some settings in html
                        var settings_html="";
 
                        // settings for easy access
                        settings_html+="<div class='display-none sk-google-reviews-settings' style='display:none;'>";
                            jQuery.each(data, function(key, value){ settings_html+="<div class='" + key + "'>" + value + "</div>"; });
                         settings_html+="</div>";
 
                        if(sk_google_reviews.find('.sk-google-reviews-settings').length){
                            // no settings
                        }
                        else{
                            sk_google_reviews.prepend(settings_html);
                        }
                        var layout = getDsmSetting(sk_google_reviews, "layout");
                        if(layout == 3){
                            loadGoogleReviewsForSliderLayout(jQuery, sk_google_reviews);
                        }else{
                            loadGoogleReviews(jQuery, sk_google_reviews);
                        }
                    }
                });
            })
            .catch(function(err) {
                console.log('GETTING DATA RETURN ERROR!');
                console.log(err);
            });
         });
 
         // resize elements in real time
         jQuery(window).resize(function(){
             jQuery('.sk-ww-google-reviews').each(function(){
                 var sk_google_reviews=jQuery(this);
                 applyCustomUi(jQuery, sk_google_reviews);
             });
         });
 
         jQuery(document).on('click', '.swiper-prev-arrow,.swiper-next-arrow', function(){
    var sk_google_reviews = $('.sk-ww-google-reviews');
    skLayoutSliderArrowUI(sk_google_reviews);
    
});

jQuery(document).on('click', '.prev_sk_google_review', function(){
             
    var clicked_element = jQuery(this);
    clicked_element.html("<i class='fa fa-spinner fa-pulse' aria-hidden='true'></i>");
    var new_clicked_element        = jQuery('.sk_selected_reviews').prev('.sk_fb_page_reviews_grid-item');
    
    var content_src=new_clicked_element.find('.sk-review-popup');
    showPopUp(jQuery, content_src, new_clicked_element);
    
});

jQuery(document).on('click', '.next_sk_google_review', function(){
    var clicked_element = jQuery(this);
    clicked_element.html("<i class='fa fa-spinner fa-pulse' aria-hidden='true'></i>");
    var new_clicked_element        = jQuery('.sk_selected_reviews').next('.sk_fb_page_reviews_grid-item');
    
    var content_src=new_clicked_element.find('.sk-review-popup');
    showPopUp(jQuery, content_src, new_clicked_element);
});



// trigger when 'read more' button was clicked
jQuery(document).on('click', '.google-reviews-item', function () {

    var clicked_element = jQuery(this).closest('.sk_fb_page_reviews_grid-item');
    var content_src=clicked_element.find('.sk-review-popup');

  
    showPopUp(jQuery, content_src, clicked_element);
});

jQuery(document).on('click', '.sk-google-reviews-load-more-posts', function(){

    var current_btn=jQuery(this);
    var current_btn_text=current_btn.text();
    var sk_google_reviews=jQuery(this).closest('.sk-ww-google-reviews');
    var embed_id=getDsmEmbedId(sk_google_reviews);
    var next_page=sk_google_reviews.find('.sk-google-reviews-next-page').text();
    var json_url=next_page;
    jQuery(this).html("<i class='fa fa-spinner fa-pulse' aria-hidden='true'></i>");

    var a=sk_google_reviews.find('.sk_fb_page_reviews_grid-item').offset();

    fetch(json_url, { method: 'get' })
    .then(function(response) {
        response.json().then(function(data) {
            
            var post_items="";

            jQuery.each(data.reviews, function(key, val){
                post_items+="<div class='sk_fb_page_reviews_grid-item'>";
                    post_items+=getFeedItem(val, sk_google_reviews, data.bio);
                post_items+="</div>"; // end sk_fb_page_reviews_grid-item
            });
            
            sk_google_reviews.find('.sk_fb_page_reviews_grid').append(post_items);
            //sk_google_reviews.find('.sk_fb_page_reviews_grid').append(post_items).masonry('reloadItems');

            // go back to previous button text
            current_btn.html(current_btn_text);

            // change next page value
            sk_google_reviews.find('.sk-google-reviews-next-page').text(data.page_info.next_page_url);

            // if no next page, disable load more button
            if(data.page_info.next_page_url==""){
                sk_google_reviews.find('.sk-google-reviews-load-more-posts').hide();
            }
            
            // apply customizations and sizings
            applyCustomUi(jQuery, sk_google_reviews);
            applyMasonry();
            fixMasonry();
        });
    })
    .catch(function(err) {
        console.log('GETTING DATA RETURN ERROR!');
        console.log(err);
    });
});

jQuery(document).on('click', '.sk-ww-google-reviews .sk-watermark', function(){
    jQuery('.sk-ww-google-reviews .sk-message').slideToggle();
});
 
     }); // end document ready
 }

}(window, document));