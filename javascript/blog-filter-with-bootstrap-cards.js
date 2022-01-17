$( document ).ready(function() {

var bootstrap_cards_object = {
  category_names: {},
  per_page: 50,
  categories_to_be_excluded: "0",
  date_options: { year: 'numeric', month: 'long', day: 'numeric' },
  current_offset: 0,
  empty_items_container: function(params) {
    $(".bootstrap_cards_items_container").empty();
  },
  empty_load_more_button_container: function(params) {
    $(".bootstrap_cards_load_more_button_container").empty();
  },
  toggle_spinner: function(params) {
    $(".bootstrap_cards_spinner").toggle();
  },
  add_spinner: function(params) {
    bootstrap_cards_object.empty_items_container();
    $(".bootstrap_cards_items_container").append(`
      <div class="text-center my-3">
        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
      `);
  },
  add_load_more_button: function(category_id) {
    bootstrap_cards_object.empty_load_more_button_container();
    $(".bootstrap_cards_load_more_button_container").append(`
      <button type="button" class="bootstrap_cards_load_more_button my-4" data-category-id="${category_id}">Mehr</button>
      `);

      $(".bootstrap_cards_load_more_button").on("click", function(){
        //bootstrap_cards_object.get_and_place_items($(this).data("category-id"));
        //$(".bootstrap_cards_category_button").removeClass("disabled");
        bootstrap_cards_object.get_and_append_items($(this).data("category-id"));
      });
  },
  add_listeners_for_category_buttons: function(params){
    $(".bootstrap_cards_category_button").on("click", function(){
      bootstrap_cards_object.get_and_place_items($(this).data("category-id"));
      $(".bootstrap_cards_category_button").removeClass("disabled");
      $(this).toggleClass("disabled");
    });
  },
  append_item: function(data) {

    var image_url = "";

  //  if (typeof data["_embedded"] == "undefined" || typeof data["_embedded"]["wp:featuredmedia"] == "undefined" || typeof data["_embedded"]["wp:featuredmedia"][0] == "undefined"){
  //    image_url = "https://i.picsum.photos/id/287/300/200.jpg?hmac=eVf6BLO211WaBRmmt-cOiXLvrDaqS7nqHAIVHR4YiUQ";
  //  } else {
  //    image_url = data["_embedded"]["wp:featuredmedia"][0]["media_details"]["sizes"]["large"]["source_url"];
  //  }

    if (typeof data["yoast_head_json"] == "undefined" || typeof data["yoast_head_json"]["og_image"] == "undefined" || typeof data["yoast_head_json"]["og_image"][0] == "undefined"){
      image_url = "https://i.picsum.photos/id/287/300/200.jpg?hmac=eVf6BLO211WaBRmmt-cOiXLvrDaqS7nqHAIVHR4YiUQ";
    } else {
      image_url = data["yoast_head_json"]["og_image"][0]["url"];
    }

    $(".bootstrap_cards_items_container").append(`
    <div class="col">
      <div class="card h-100 bootstrap-cards-card">
      <img src="${image_url}" class="card-img-top" style="width: 100%; height: 300px; object-fit: cover;">
        <div class="card-body">
          <h2 class="text-center bootstrap_cards_title">${data.title.rendered}</h2>
          <p class="card-text bootstrap_cards_content">${bootstrap_cards_object.truncate(data.content.rendered.replace(/(<([^>]+)>)/gi, " ").replace(/\n|\r|\t/g, ""), 25)}</p>
          <p class="text-center">
            <a href="${data.link}" class="bootstrap_cards_href stretched-link">Weiterlesen »</a>
          </p>
        </div>
        <div class="card-footer bg-white text-center bootstrap_cards_footer">
          ${new Date(data.date).toLocaleDateString('de-DE', bootstrap_cards_object.date_options)}
        </div>
      </div>
    </div>
      `);
  },
  append_item_with_tag: function(data) {

    var image_url = "";

    if (typeof data["yoast_head_json"] == "undefined" || typeof data["yoast_head_json"]["og_image"] == "undefined" || typeof data["yoast_head_json"]["og_image"][0] == "undefined"){
      image_url = "https://i.picsum.photos/id/287/300/200.jpg?hmac=eVf6BLO211WaBRmmt-cOiXLvrDaqS7nqHAIVHR4YiUQ";
    } else {
      image_url = data["yoast_head_json"]["og_image"][0]["url"];
    }

    $(".bootstrap_cards_items_container").append(`
    <div class="col">
      <div class="card h-100 bootstrap-cards-card">
      <img src="${image_url}" class="card-img-top" style="width: 100%; height: 300px; object-fit: cover;">
        <div class="card-body">
        <span class="bootstrap_cards_pill">
            ${bootstrap_cards_object.category_names[data.categories[0]]}
          </span>

          <h2 class="text-center bootstrap_cards_title">${data.title.rendered}</h2>
          <p class="card-text bootstrap_cards_content">${bootstrap_cards_object.truncate(data.content.rendered.replace(/(<([^>]+)>)/gi, " ").replace(/\n|\r|\t/g, ""), 25)}</p>
          <p class="text-center">
            <a href="${data.link}" class="bootstrap_cards_href stretched-link">Weiterlesen »</a>
          </p>
        </div>
        <div class="card-footer bg-white text-center bootstrap_cards_footer">
          ${new Date(data.date).toLocaleDateString('de-DE', bootstrap_cards_object.date_options)}
        </div>
      </div>
    </div>
      `);
  },
  get_and_append_items: function(category_id) {

    bootstrap_cards_object.current_offset = bootstrap_cards_object.current_offset + bootstrap_cards_object.per_page;

    var data = {
      per_page: bootstrap_cards_object.per_page,
      offset: bootstrap_cards_object.current_offset
    };

    if(category_id == "all"){

    } else {
      data.categories = category_id;
    }

    $.ajax({
      method: "GET",
      url: window.location.origin + "/wp-json/wp/v2/posts?_embed",
      data: data
    })
    .done(function( data ) {

      if(category_id == "all"){
        for (var i = 0; i < data.length; i++) {
          bootstrap_cards_object.append_item_with_tag(data[i]);
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          bootstrap_cards_object.append_item(data[i]);
        }
      }

      //bootstrap_cards_object.add_load_more_button(category_id);
      bootstrap_cards_object.empty_load_more_button_container();

      if(data.length >= bootstrap_cards_object.per_page ){
        bootstrap_cards_object.add_load_more_button(category_id);
      } else {

      }

    });
  },
  get_and_place_items: function(category_id) {
    bootstrap_cards_object.toggle_spinner();
    bootstrap_cards_object.empty_items_container();
    bootstrap_cards_object.empty_load_more_button_container();
    bootstrap_cards_object.current_offset = 0;

    var data = {
      per_page: bootstrap_cards_object.per_page
    };

    if(category_id == "all"){

    } else {
      data.categories = category_id;
    }

    $.ajax({
      method: "GET",
      url: window.location.origin + "/wp-json/wp/v2/posts?_embed",
      data: data
    })
    .done(function( data ) {

      bootstrap_cards_object.toggle_spinner();
      bootstrap_cards_object.empty_items_container();

      if(category_id == "all"){
        for (var i = 0; i < data.length; i++) {
          bootstrap_cards_object.append_item_with_tag(data[i]);
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          bootstrap_cards_object.append_item(data[i]);
        }
      }



      if(data.length >= bootstrap_cards_object.per_page ){
        bootstrap_cards_object.add_load_more_button(category_id);
      } else {
        bootstrap_cards_object.empty_load_more_button_container();
      }


    });
  },
  get_and_place_categories: function(params) {

    $.ajax({
      method: "GET",
      url: window.location.origin + "/wp-json/wp/v2/categories",
      data: {exclude: bootstrap_cards_object.categories_to_be_excluded}
    })
    .done(function( data ) {
      $(".bootstrap_cards_buttons_container").empty();
      $(".bootstrap_cards_buttons_container").append(`
        <button type="button" class="bootstrap_cards_category_button bootstrap_cards_category_button_all mb-4" data-category-id="all">Alle anzeigen</button>
        `);

      for (var i = 0; i < data.length; i++) {

        bootstrap_cards_object.category_names[data[i].id] = data[i].name;

        $(".bootstrap_cards_buttons_container").append(`
          <button type="button" class="bootstrap_cards_category_button my-2" data-category-id=${data[i].id}>${data[i].name}</button>
          `);
      }
      bootstrap_cards_object.add_listeners_for_category_buttons();
    });
  },
  truncate: function(string, max) {
          var array = string.trim().split(' ');
          var filtered_array = array.filter(function(el) { return el; });
          var ellipsis = array.length > max ? '...' : '';
          return filtered_array.slice(0, max).join(' ') + ellipsis;
        }
};


    bootstrap_cards_object.categories_to_be_excluded = $(".bootstrap_cards_container").data("categories-to-be-excluded");
    bootstrap_cards_object.per_page = $(".bootstrap_cards_container").data("per-page");

    bootstrap_cards_object.get_and_place_categories();
    bootstrap_cards_object.get_and_place_items("all");
});
