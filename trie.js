function isUndefined(obj) {
  return typeof obj == "undefined";
}

function Trie() {
	this.root = {};
	/**
	 * onExactMatch(the word, the node matching the word);
	 * onMissingBranch(the word, the index of word diverging from the trie, the last visited node, number of chars advanced since last node);
	 * onInputWordEnd(the word, last visited node, the number of chars since last visited node);
	 */
	this.traverse = function(word, onExactMatch, onMissingBranch, onInputWordEnd) {
		var currentNode = this.root;
		var currentIndex = 0;
		while (currentIndex < word.length) {
			var currentChar = word.charAt(currentIndex);
			if (isUndefined(currentNode[currentChar]))
				return onMissingBranch(word, currentIndex, currentNode, 0);
			var trieWord = currentNode[currentChar].word;
			var nextNode = currentNode[currentChar].node;
			var trieWordIndex = 0;
			
			for (;trieWordIndex < trieWord.length; ++trieWordIndex, ++currentIndex) {
				if (!(currentIndex < word.length))
					return onInputWordEnd(word, currentNode, trieWordIndex);
				if(word.charAt(currentIndex) != trieWord.charAt(trieWordIndex))
					return onMissingBranch(word, currentIndex, currentNode, trieWordIndex);
			}
			currentNode = nextNode;
		}
		return onExactMatch(word, currentNode);
	};
	this.addWord = function(word, value) {
		var onExactMatch = function(word, currentNode) {
			currentNode.value = value;
			return;
		};
		var onSplit = function(word, parent, firstChar, advanced) {
			var newNode = {};
			if (isUndefined(parent[firstChar]))
				throw "parent has no child with " + firstChar;
			var oldNode = parent[firstChar].node;
			var oldWord = parent[firstChar].word;
			
			parent[firstChar].node = newNode;
			parent[firstChar].word = oldWord.substr(0, advanced);
			
			var chr =oldWord.charAt(advanced);
			newNode[chr] = {};
			newNode[chr].node = oldNode;
			newNode[chr].word = oldWord.substr(advanced);
			
			return newNode;
		};
		var onMissingBranch = function(word, currentIndex, lastNode, advanced) {
			var newNode = {};
			
			if (advanced != 0)
				lastNode = onSplit(word, lastNode, word.charAt(currentIndex - advanced), advanced);
			var chr = word.charAt(currentIndex);
			lastNode[chr] = {};
			lastNode[chr].node = newNode;
			lastNode[chr].word = word.substr(currentIndex);
			newNode.value = value;
			return;
		};
		var onInputWordEnd = function(word, lastNode, advanced) {
			var newNode = onSplit(word, lastNode, word.charAt(word.length - advanced), advanced);
			newNode.value = value;
			return;
		};
		
		this.traverse(word, onExactMatch, onMissingBranch, onInputWordEnd);
	};
	this.getValue = function(word) {
		var onExactMatch = function(word, currentNode) {
			return currentNode.value;
		};
	
		var onMissingBranch = function(word, currentIndex, lastNode, advanced) {
			return null;
		};
		var onInputWordEnd = function(word, lastNode, advanced) {
			return null;
		};
		return this.traverse(word, onExactMatch, onMissingBranch, onInputWordEnd);
	};
}

//Testing

/*
var trie = new Trie();

trie.addWord("banica", "boza");
trie.addWord("banana", "peanuts");


println(trie.getValue("banica"));
println(trie.getValue("banan"));
println(trie.getValue("banana"));
println(trie.getValue("bananaa"));
*/
