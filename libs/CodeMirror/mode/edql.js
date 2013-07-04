/*
 *	EDQL Mode for CodeMirror 2 by Hawk R&D
 *	@author Avinash Yadav 
 *	@version Aug/2012
*/
CodeMirror.defineMode("edql", function(config) {
  var indentUnit = config.indentUnit;
  var curPunc;
  
  var eDKeywords = [
        ('AND'), ('OR'), ('NOT'), ('NEAR'), ('N'), ('BEFORE'), ('B'), ('EXCEPT'), ('X'),
        // file attributes
        ('containerId'), ('contId'), 
        ('cumulativeFolderPath'), 
        ('dataSize'), ('contentSize'), 
        ('descName'), ('descendantName'), ('descendantNames'), ('descNames'),
        ('elementComp'), ('elemComp'),
        ('elementId'), ('documentId'), ('elemId'),
        ('elementKind'), ('elemKind'),
        ('elementRole'), ('elemRole'),
        ('fileAccessedDate'),
        ('fileCreatedDate'),
        ('fileMediaType'),
        ('fileModifiedDate'),
        ('fileUniformTypeId'),
        ('filename'),
        ('groupHeadElem'),
        ('language'),
        ('localFileTypeId'),
        ('fileType'),
        ('name'),
        ('relativeFolderPath'),
        ('sourceFileSize'),
        ('subject'), ('documentSubject'), ('messageSubject'),
        
        // case-related attributes
        ('caseId'), ('collectionId'), ('collectionName'), ('custodianId'),
        
        // application-specific document attributes
        ('documentAuthor'), ('documentCategory'), ('documentComments'), ('documentCompany'), ('documentCreatedDate'), ('documentDate'), ('documentKeywords'), 
        ('documentModifiedDate'), ('documentRevisionNumber'), ('documentTitle'),
        
        // context-attributes
        ('contextFileAccessedDate'), ('contextFileCreatedDate'), ('contextFileModifiedDate'), ('contextFilename'), ('contextFileOwner'), ('contextFileUnixPerms'), 
        ('contextFolderPath'), ('sourceFolderPath'),
        
        //import related
        ('archivedDate'), ('collectedDate'), ('contentReasonCode'), ('contentStatusCode'), ('indexedDate'), ('indexSystemVersion'),
        ('isUnsearchable'), ('documentIsUnsearchable'), ('textExtractedDate'), ('sourceSystemUri'), ('sourceType'), ('storeSystemVersion'),
        
        //message attributes
        ('messageBcc'), ('bcc'), 
        ('messageCc'), ('cc'),
        ('messageClass'), ('messageFlags'), 
        ('messageFrom'), ('from'), ('sender'),
        ('messageId'), 
        ('messageRcptTo'),
        ('messageReceivedDate'), 
        ('messageRecipients'),
        ('messageReferenceIds'),
        ('messageReplyToId'),
        ('messageSentDate:'),
        ('messageSubject'),
        ('messageTo'),
        
        //count attributes
        ('numContDocs'), ('familyDocumentCount'), ('numContainerDocs'),
        ('numDescDocs'),
        ('numDescElems'),
        ('numGroupDocs'),
        
        // hash attributes
        ('containerFullHash'), ('contFullHash'),
        ('fullHash'), 
        ('streamHash'), 
        ('contentHash'), 
        ('dataHash'),
        
        // content
        ('bodyContent'), ('body'),
        ('descContent'), ('attachments'), ('descendants'),
        ('content'), 
        ('allContent')
   ];

  function wordRegexp(words) {
    return new RegExp("^(?:" + words.join("|") + ")$");
  }
  
  function nearMatchRegexp(words) {
	    return new RegExp("^(?:" + words.join("|") + ")$", "i");
  }
  
  var ops = wordRegexp([]);
  var keywords = wordRegexp(eDKeywords);
  var nearKeywords = nearMatchRegexp(eDKeywords);
  var operatorChars = /[*+\-<>=&|]/;

  function tokenBase(stream, state) {
	 //console.log('tokenBase : lot of magic goes here');
    var ch = stream.next();
    //console.log('what is ch : '+ch);
    curPunc = null;
    if (ch == "$" || ch == "?") {
      stream.match(/^[\w\d]*/);
      return "variable-2";
    }
    else if (ch == "<" && !stream.match(/^[\s\u00a0=]/, false)) {
      stream.match(/^[^\s\u00a0>]*>?/);
      return "atom";
    }
    else if (ch == "\"" || ch == "'") {
      state.tokenize = tokenLiteral(ch);
      return state.tokenize(stream, state);
    }
    else if (ch == "`") {
      state.tokenize = tokenOpLiteral(ch);
      return state.tokenize(stream, state);
    }
    else if (/[{}\(\),\.;\[\]]/.test(ch)) {
      curPunc = ch;
      return null;
    }
    else if (ch == "-") {
      var ch2 = stream.next();
      if (ch2=="-") {
      	stream.skipToEnd();
      	return "comment";
      }
    }
    else if (operatorChars.test(ch)) {
      stream.eatWhile(operatorChars);
      return null;
    }
    /*else if (ch == ":") {
      stream.eatWhile(/[\w\d\._\-]/);
      return "atom";
    }*/
    else {
      stream.eatWhile(/[_\w\d]/);
      /*if (stream.eat(":")) {
        stream.eatWhile(/[\w\d_\-]/);
        return "atom";
      }*/
      var word = stream.current(), type;
      if (ops.test(word))
        return null;
      else if (keywords.test(word)) // do exact match
        return "keyword";
      else if (nearKeywords.test(word)) // do near match
      	return "near-keyword";  
      else
        return "variable";
    }
  }

  function tokenLiteral(quote) {
	  //console.log('tokenLiteral : start');
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      return "string";
    };
  }

  function tokenOpLiteral(quote) {
	  //console.log('tokenOpLiteral : start');
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      return "variable-2";
    };
  }


  function pushContext(state, type, col) {
    state.context = {prev: state.context, indent: state.indent, col: col, type: type};
  }
  function popContext(state) {
    state.indent = state.context.indent;
    state.context = state.context.prev;
  }

  return {
    startState: function(base) {
      //console.log("START STATE CALLED");	
      return {tokenize: tokenBase,
              context: null,
              indent: 0,
              col: 0};
    },

    token: function(stream, state) {
    //console.log('token called : '+stream.string);	
      if (stream.sol()) {
        if (state.context && state.context.align == null) state.context.align = false;
        state.indent = stream.indentation();
      }
      if (stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      //console.log('what is style : '+style);

      if (style != "comment" && state.context && state.context.align == null && state.context.type != "pattern") {
        state.context.align = true;
      }

      if (curPunc == "(") pushContext(state, ")", stream.column());
      else if (curPunc == "[") pushContext(state, "]", stream.column());
      else if (curPunc == "{") pushContext(state, "}", stream.column());
      else if (/[\]\}\)]/.test(curPunc)) {
        while (state.context && state.context.type == "pattern") popContext(state);
        if (state.context && curPunc == state.context.type) popContext(state);
      }
      else if (curPunc == "." && state.context && state.context.type == "pattern") popContext(state);
      else if (/atom|string|variable/.test(style) && state.context) {
        if (/[\}\]]/.test(state.context.type))
          pushContext(state, "pattern", stream.column());
        else if (state.context.type == "pattern" && !state.context.align) {
          state.context.align = true;
          state.context.col = stream.column();
        }
      }

      return style;
    },

    indent: function(state, textAfter) {
    	//console.log('indent start');
      var firstChar = textAfter && textAfter.charAt(0);
      var context = state.context;
      if (/[\]\}]/.test(firstChar))
        while (context && context.type == "pattern") context = context.prev;

      var closing = context && firstChar == context.type;
      if (!context)
        return 0;
      else if (context.type == "pattern")
        return context.col;
      else if (context.align)
        return context.col + (closing ? 0 : 1);
      else
        return context.indent + (closing ? 0 : indentUnit);
    }
  };
});

CodeMirror.defineMIME("text/x-edql", "edql");
