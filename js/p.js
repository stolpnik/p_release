var templates = {};

templates['page']=new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div id=\"p\">");_.b("\n" + i);_.b(_.t(_.f("title",c,p,0)));_.b("\n" + i);if(_.s(_.f("pages",c,p,1),c,p,0,36,192,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("		<div id=\"");_.b(_.v(_.f("pageId",c,p,0)));_.b("\" class=\"page\" data-page-num=\"");_.b(_.v(_.f("pageNum",c,p,0)));_.b("\" data-original-zindex=\"");_.b(_.v(_.f("zIndex",c,p,0)));_.b("\" style=\"z-index:");_.b(_.v(_.f("zIndex",c,p,0)));_.b(";\">");_.b("\n" + i);_.b("			");_.b(_.t(_.f("pageHtml",c,p,0)));_.b("\n" + i);_.b("		</div>");_.b("\n");});c.pop();}_.b("<div id=\"page-no\">");_.b("\n" + i);_.b("<div id=\"current-page\">1</div>/<div id=\"total-pages\">");_.b(_.v(_.f("totalPages",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("<div id=\"info\">");_.b("\n" + i);_.b("<ul>");_.b("\n" + i);_.b("<li>→:go next</li>");_.b("\n" + i);_.b("<li>←:go back</li>");_.b("\n" + i);_.b("<li>↑:go first</li>");_.b("\n" + i);_.b("<li>↓:go last</li>");_.b("\n" + i);_.b("</ul>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("</div>");return _.fl();;});
(function($){

var P, R, S,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

S = null;

R = null;

P = (function() {
  /*
  	* constatns
  */

  /**
  	@property SPLIT_STR
  	@static
  	@default |||||
  	@since 0.1.0
  */

  P.SPLIT_STR = "|||||";

  /**
  	@property LEFT
  	@static
  	@default 37
  	@since 0.1.0
  */


  P.LEFT = 37;

  /**
  	@property UP
  	@static
  	@default 38
  	@since 0.1.0
  */


  P.UP = 38;

  /**
  	@property RIGHT
  	@static
  	@default 39
  	@since 0.1.0
  */


  P.RIGHT = 39;

  /**
  	@property DOWN
  	@static
  	@default 40
  	@since 0.1.0
  */


  P.DOWN = 40;

  /**
  	@property IDLE
  	@static
  	@default 0
  	@since 0.1.0
  */


  P.IDLE = 0;

  /**
  	@property FIRED
  	@static
  	@default 1
  	@since 0.1.0
  */


  P.FIRED = 1;

  /*
  	* properties
  */


  /**
  	@property data
  	@type Object
  	@default null
  	@since 0.1.0
  */


  P.prototype.data = null;

  /**
  	@property title
  	@type String
  	@default null
  	@since 0.1.0
  */


  P.prototype.title = null;

  /**
  	@property pages
  	@type Array
  	@default null
  	@since 0.1.0
  */


  P.prototype.pages = null;

  /**
  	@property renderer
  	@type Renderer
  	@default null
  	@since 0.1.0
  */


  P.prototype.renderer = null;

  /**
  	@property lastPage
  	@type Number
  	@default 1
  	@since 0.1.0
  */


  P.prototype.lastPage = 1;

  /**
  	@property currentPage
  	@type Number
  	@default 1
  	@since 0.1.0
  */


  P.prototype.currentPage = 1;

  /**
  	@property totalPages
  	@type Number
  	@default 1
  	@since 0.1.0
  */


  P.prototype.totalPages = 0;

  /**
  	@property keyState
  	@type Number
  	@default P.IDLE
  	@since 0.1.0
  */


  P.prototype.keyState = P.IDLE;

  /**
  	simple slide for presentation
  
  	@class P
  	@constructor
  	@param {String} [target=body]
  	@param {Renderer} [renderer=S]
  	@since 0.1.0
  */


  function P(target, renderer) {
    if (target == null) {
      target = 'body';
    }
    if (renderer == null) {
      renderer = S;
    }
    this.pageMoveWithSwipe = __bind(this.pageMoveWithSwipe, this);

    this.pageMove = __bind(this.pageMove, this);

    this.data = "";
    this.title = "";
    this.pages = [];
    this.renderer = new renderer(target);
  }

  /**
  	@method init
  	@param [target=p.md] {String} path to markdown file to load
  	@since 0.1.0
  */


  P.prototype.init = function(target) {
    var dfd, myself;
    if (target == null) {
      target = "p.md";
    }
    myself = this;
    dfd = $.Deferred();
    $.when(this.load(target)).done(function(d) {
      myself.addPages(myself.parse(d));
      myself.setup();
      return dfd.resolve();
    }).fail(function(e) {
      throw e;
      return dfd.reject();
    });
    return dfd.promise();
  };

  /**
  	@method load
  	@param [target=p.md] {String} path to markdown file to load
  	@since 0.1.0
  */


  P.prototype.load = function(target) {
    var dfd;
    if (target == null) {
      target = "p.md";
    }
    dfd = $.get(target);
    $.when(dfd).done(function(d) {
      return this.data = d;
    }).fail(function(e) {
      throw e;
    });
    return dfd;
  };

  /**
  	@method parse
  	@param data {Object} data object converted from md
  	@since 0.1.0
  */


  P.prototype.parse = function(data) {
    var converter;
    converter = new Showdown.converter();
    return converter.makeHtml(data);
  };

  /**
  	add pages to slide
  
  	@method addPages
  	@param md {String}
  	@since 0.1.0
  */


  P.prototype.addPages = function(md) {
    var i, pageBodies, pageTitles, pt, title, titleRegExp, _i, _len, _results;
    titleRegExp = /(<h1.+"?>.+<\/h1>)/;
    title = md.match(titleRegExp);
    if (title[0] != null) {
      this.title = title[0];
    }
    md = md.replace(titleRegExp, '');
    pageTitles = md.match(/(<h2.+"?>.+<\/h2>)/g);
    md = md.replace(/(<h2.+"?>.+<\/h2>)/g, P.SPLIT_STR);
    pageBodies = md.split(P.SPLIT_STR);
    pageBodies.shift();
    this.totalPages = pageTitles.length;
    _results = [];
    for (i = _i = 0, _len = pageTitles.length; _i < _len; i = ++_i) {
      pt = pageTitles[i];
      _results.push(this.pages.push("" + pt + "\n" + pageBodies[i]));
    }
    return _results;
  };

  /**
  	set up presentation!
  
  	@method setup
  	@since 0.1.0
  */


  P.prototype.setup = function() {
    var _this = this;
    this.renderer.render(this);
    $(document).keydown(this.pageMove);
    $(document).keyup(function(e) {
      return _this.keyState = P.IDLE;
    });
    $(window).swipe({
      swipe: this.pageMoveWithSwipe
    });
    $(window).resize(this.renderer.resize);
    return this.restoreFromUrl();
  };

  /**
  	show a passed page
  
  	@method show
  	@param {Number} [pageNum=1] page number to show
  	@since 0.1.0
  */


  P.prototype.show = function(pageNum) {
    var page;
    if (pageNum == null) {
      pageNum = 1;
    }
    this.lastPage = this.currentPage;
    this.currentPage = pageNum;
    page = this.pages[pageNum - 1];
    this.renderer.showPage(pageNum, this.lastPage);
    location.hash = "#" + pageNum;
    return page;
  };

  /**
  	event handler for page move
  
  	@method pageMove
  	@param {Event} e
  	@protected
  	@since 0.1.0
  */


  P.prototype.pageMove = function(e) {
    if (this.keyState === P.FIRED) {
      return;
    }
    switch (e.keyCode) {
      case P.RIGHT:
        this.next();
        return this.keyState = P.FIRED;
      case P.LEFT:
        this.prev();
        return this.keyState = P.FIRED;
      case P.UP:
        this.show(1);
        return this.keyState = P.FIRED;
      case P.DOWN:
        this.show(this.totalPages);
        return this.keyState = P.FIRED;
    }
  };

  /*
  	restore page from url
  
  	@method restoreFromUrl
  	@since 0.1.2
  */


  P.prototype.restoreFromUrl = function() {
    var hash;
    hash = location.hash.match(/#(\d+)/);
    if ((hash != null ? hash.length : void 0) > 1) {
      return this.show(parseInt(hash[1], 10));
    }
  };

  /*
  	event handler for swipe(using jquery.touchSwipe.js)
  
  	@method pageMoveWithSwipe
  */


  P.prototype.pageMoveWithSwipe = function(e, dir, dist, duration, fingerCount) {
    switch (dir) {
      case "right":
        return this.next();
      case "left":
        return this.prev();
      case "up":
        return this.show(1);
      case "down":
        return this.show(this.totalPages);
    }
  };

  /**
  	show a next page
  
  	@method next
  	@since 0.1.0
  */


  P.prototype.next = function() {
    var nextPage;
    nextPage = this.currentPage === this.totalPages ? 1 : this.currentPage + 1;
    return this.show(nextPage);
  };

  /**
  	show a prev page
  
  	@method prev
  	@since 0.1.0
  */


  P.prototype.prev = function() {
    var prevPage;
    prevPage = this.currentPage === 1 ? this.totalPages : this.currentPage - 1;
    return this.show(prevPage);
  };

  return P;

})();

if (typeof define !== "undefined" && define !== null) {
  define(["s", "r"], function(s, r) {
    S = s;
    R = r;
    return {
      P: P,
      S: S,
      R: R
    };
  });
} else {
  this.p || (this.p = {});
  this.p.P = P;
  S = this.p.S;
}

var S;

S = (function() {

  function S(target) {
    this.target = $(target);
  }

  S.prototype.render = function(p) {
    var i, page;
    this.container = $(templates.page.render({
      title: p.title,
      totalPages: p.totalPages,
      pages: (function() {
        var _i, _len, _ref, _results;
        _ref = p.pages;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          page = _ref[i];
          _results.push({
            pageNum: i + 1,
            pageId: "page-" + (i + 1),
            zIndex: p.totalPages - i,
            pageHtml: page
          });
        }
        return _results;
      })()
    }));
    this.target.append(this.container);
    $("div.page", this.container).hide();
    $("div#page-1", this.container).show();
    $("#p").on("webkitAnimationStart", "div.page", function() {});
    $("#p").on("webkitAnimationEnd", "div.page", function() {});
    this.resize();
    return $("h1", this.target).click(function() {
      if (document.body.webkitRequestFullScreen != null) {
        return document.body.webkitRequestFullScreen();
      }
    });
  };

  S.prototype.resize = function(e) {
    var pageHeight, t;
    t = $("div.page", this.container);
    pageHeight = $(window).height();
    return t.css({
      top: (pageHeight - t.height()) * 0.5
    });
  };

  S.prototype.showPage = function(page, lastPage) {
    if (lastPage != null) {
      $("#page-" + lastPage).hide();
    }
    $("#page-" + page).show();
    return $("#current-page").text(page);
  };

  return S;

})();

if (typeof define !== "undefined" && define !== null) {
  define(function() {
    return S;
  });
} else {
  this.p || (this.p = {});
  this.p.S = S;
}

})(jQuery);