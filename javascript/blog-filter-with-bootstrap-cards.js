$( document ).ready(function() {

var bootstrap_cards_object = {
  endpoint: "",
  category_names: {},
  per_page: 50,
  categories_to_be_excluded: "0",
  categories_of_current_page: "0",
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
  toggle_sub_category: function(params) {
    $(".bootstrap_cards_sub_category").toggle();
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
  get_image_url: function(data) {
    var image_url = "";

    if (typeof data["_embedded"] == "undefined" || typeof data["_embedded"]["wp:featuredmedia"] == "undefined" || typeof data["_embedded"]["wp:featuredmedia"][0] == "undefined"){
      //image_url = "https://i.picsum.photos/id/287/300/200.jpg?hmac=eVf6BLO211WaBRmmt-cOiXLvrDaqS7nqHAIVHR4YiUQ";
    } else {

      var sizes = data["_embedded"]["wp:featuredmedia"][0]["media_details"]["sizes"];

      if (typeof sizes["medium_large"] !== "undefined") {
        image_url = sizes["medium_large"]["source_url"];
      } else if (typeof sizes["large"] !== "undefined") {
        image_url = sizes["large"]["source_url"];
      } else if (typeof sizes["medium"] !== "undefined") {
        image_url = sizes["medium"]["source_url"];
      } else if (typeof sizes["full"] !== "undefined") {
        image_url = sizes["full"]["source_url"];
      }

    }

    if(image_url === ""){
      if (typeof data["yoast_head_json"] == "undefined" || typeof data["yoast_head_json"]["og_image"] == "undefined" || typeof data["yoast_head_json"]["og_image"][0] == "undefined"){
        image_url = "https://i.picsum.photos/id/287/300/200.jpg?hmac=eVf6BLO211WaBRmmt-cOiXLvrDaqS7nqHAIVHR4YiUQ";
      } else {
        image_url = data["yoast_head_json"]["og_image"][0]["url"];
      }
    }

    return image_url;
  },
  append_item: function(data) {
    var image_url = bootstrap_cards_object.get_image_url(data);

    $(".bootstrap_cards_items_container").append(`
    <div class="col">
      <div class="card h-100 bootstrap-cards-card">
      <img src="${image_url}" class="card-img-top" style="width: 100%; height: 340px; object-fit: cover;">
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

    var image_url = bootstrap_cards_object.get_image_url(data);

    $(".bootstrap_cards_items_container").append(`
    <div class="col">
      <div class="card h-100 bootstrap-cards-card">
      <img src="${image_url}" class="card-img-top" style="width: 100%; height: 340px; object-fit: cover;">
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
      url: bootstrap_cards_object.endpoint + "wp/v2/posts?_embed",
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
  get_and_place_items: function(category_ids) {
    bootstrap_cards_object.toggle_spinner();
    bootstrap_cards_object.empty_items_container();
    bootstrap_cards_object.empty_load_more_button_container();
    bootstrap_cards_object.current_offset = 0;
    bootstrap_cards_object.toggle_sub_category();

    //hide all sub category containers and show sub category container, if it exists
    $(".sub-category-container").hide();

    var splitted_category_ids = String(category_ids).split(',');

    for (var i = 0; i < splitted_category_ids.length; i++) {
          $("*[data-sub-category-container-parent-id=" + splitted_category_ids[i] + "]").show();
          $("*[data-category-id=" + splitted_category_ids[i] + "]").parent().show();
    }


    var data = {
      per_page: bootstrap_cards_object.per_page
    };

    if(category_ids == "all"){

    } else {
      data.categories = category_ids;
    }

    $.ajax({
      method: "GET",
      url: bootstrap_cards_object.endpoint + "wp/v2/posts?_embed",
      data: data
    })
    .done(function( data ) {

      bootstrap_cards_object.toggle_spinner();
      bootstrap_cards_object.empty_items_container();

      if(category_ids == "all"){
        for (var i = 0; i < data.length; i++) {
          bootstrap_cards_object.append_item_with_tag(data[i]);
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          bootstrap_cards_object.append_item(data[i]);
        }
      }



      if(data.length >= bootstrap_cards_object.per_page ){
        bootstrap_cards_object.add_load_more_button(category_ids);
      } else {
        bootstrap_cards_object.empty_load_more_button_container();
      }


    });
  },
  get_and_place_itemsx: function(category_ids) {
    bootstrap_cards_object.toggle_spinner();
    bootstrap_cards_object.empty_items_container();
    bootstrap_cards_object.empty_load_more_button_container();
    bootstrap_cards_object.current_offset = 0;

    var data = {
      per_page: bootstrap_cards_object.per_page
    };

    if(category_ids == "all"){

    } else {
      data.categories = category_ids;
    }

    $.ajax({
      method: "GET",
      url: bootstrap_cards_object.endpoint + "wp/v2/posts?_embed",
      data: data
    })
    .done(function( data ) {

      bootstrap_cards_object.toggle_spinner();
      bootstrap_cards_object.empty_items_container();

      if(category_ids == "all"){
        for (var i = 0; i < data.length; i++) {
          bootstrap_cards_object.append_item_with_tag(data[i]);
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          bootstrap_cards_object.append_item(data[i]);
        }
      }

      if(data.length >= bootstrap_cards_object.per_page ){
        bootstrap_cards_object.add_load_more_button(category_ids);
      } else {
        bootstrap_cards_object.empty_load_more_button_container();
      }

    });
  },
  get_and_place_categories: function(params) {

    return new Promise(function(resolve, reject) {

    $.ajax({
      method: "GET",
      url: bootstrap_cards_object.endpoint + "wp/v2/categories",
      data: {exclude: bootstrap_cards_object.categories_to_be_excluded}
    })
    .done(function( data ) {
      //$(".bootstrap_cards_buttons_container").empty();

      var bootstrap_cards_buttons_for_main_categories_container = ".bootstrap_cards_buttons_for_main_categories";
      var bootstrap_cards_buttons_for_sub_categories_container = ".bootstrap_cards_buttons_for_sub_categories";

      $(bootstrap_cards_buttons_for_main_categories_container).empty();
      $(bootstrap_cards_buttons_for_sub_categories_container).empty();

      var array_of_disabled_categories = bootstrap_cards_object.categories_of_current_page.split(',');

      let additional_class2 = "";

      if(array_of_disabled_categories.includes("all")) {
        additional_class2 = "disabled";
      }

      $(bootstrap_cards_buttons_for_main_categories_container).append(`
        <button type="button" class="bootstrap_cards_category_button bootstrap_cards_category_button_all mb-4 ${additional_class2}" data-category-id="all">Alle anzeigen</button>
        `);


      for (var i = 0; i < data.length; i++) {

        bootstrap_cards_object.category_names[data[i].id] = data[i].name;

        let additional_class = "";

        if(array_of_disabled_categories.includes(data[i].id.toString())) {
          additional_class = "disabled";
        }

        //if category has no parent, it goes to the main buttons container, otherwise in the sub container
        if(data[i].parent === 0) {
          $(bootstrap_cards_buttons_for_main_categories_container).append(`
            <button type="button" class="bootstrap_cards_category_button my-2 ${additional_class}" data-category-id=${data[i].id}>${data[i].name}</button>
          `);
        } else {

          //if container for sub category does not exist, create one
          if($("*[data-sub-category-container-parent-id=" + data[i].parent + "]").length === 0) {
            $(bootstrap_cards_buttons_for_sub_categories_container).append(`
              <div class="sub-category-container" data-sub-category-container-parent-id="${data[i].parent}" style="display:none;">
              <button type="button" class="bootstrap_cards_category_button bootstrap_cards_sub_category_button my-2 ${additional_class}" data-category-id=${data[i].id} data-parent-category-id=${data[i].parent}>${data[i].name}</button>
              </div>
            `);
          } else {
            $("*[data-sub-category-container-parent-id=" + data[i].parent + "]").append(`

              <button type="button" class="bootstrap_cards_category_button bootstrap_cards_sub_category_button my-2 ${additional_class}" data-category-id=${data[i].id} data-parent-category-id=${data[i].parent}>${data[i].name}</button>
              `);
          }

        }

        if((i+1) === data.length){
          resolve("added categories");
        }

      }
      bootstrap_cards_object.add_listeners_for_category_buttons();

    });
  });
  },
  truncate: function(string, max) {
          var array = string.trim().split(' ');
          var filtered_array = array.filter(function(el) { return el; });
          var ellipsis = array.length > max ? '...' : '';
          return filtered_array.slice(0, max).join(' ') + ellipsis;
        }
};

// Do this when shortcode is loaded on the page.

  var set_categories_to_be_excluded = new Promise(function(resolve, reject) {
    bootstrap_cards_object.categories_to_be_excluded = $(".bootstrap_cards_container").data("categories-to-be-excluded");
    resolve("categories to be excluded set");
  });

  var set_per_page = new Promise(function(resolve, reject) {
    bootstrap_cards_object.per_page = $(".bootstrap_cards_container").data("per-page");
    resolve("per page set");
  });

  var set_endpoint = new Promise(function(resolve, reject) {
    bootstrap_cards_object.endpoint = document.querySelector('link[rel="https://api.w.org/"]').href;
    resolve("endpoint set");
  });

  var set_categories_of_current_post = new Promise(function(resolve, reject) {

    var shortlink = document.querySelector('link[rel="shortlink"]').href;
    var urlParams = new URLSearchParams(shortlink.split("?")[1]);
    var post_id = urlParams.get("p");

    $.ajax({
      method: "GET",
      url: bootstrap_cards_object.endpoint + "wp/v2/categories?post=" + post_id
    })
    .done(function( result ) {

      let category_string = "";

      if (result.length === 0) {
        category_string = "all"
      }

      for (var i = 0; i < result.length; i++) {
        if (i + 1 == result.length) {
          category_string = category_string + result[i].id;
        } else {
          category_string = category_string + result[i].id + ",";
        }
      }

      bootstrap_cards_object.categories_of_current_page = category_string;
      resolve("categories of current post set");

    })
    .fail(function( result ){
      bootstrap_cards_object.categories_of_current_page = "all";
      resolve("categories of current post set");
    });

  });

  Promise.all([set_categories_to_be_excluded, set_per_page, set_endpoint, set_categories_of_current_post])
  .then(function() {
    // all loaded
    bootstrap_cards_object.get_and_place_categories().then(function(){
      bootstrap_cards_object.get_and_place_items(bootstrap_cards_object.categories_of_current_page)
    });

  }, function() {
    // one or more failed
    console.log("ERROR!");
  });

});
