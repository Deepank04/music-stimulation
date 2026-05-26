// ================= TREE STRUCTURE =================
class MusicNode {
    constructor(name) {
        this.name = name;
        this.children = [];
    }
}

// Build Tree
let root = new MusicNode("peace");
let calm = new MusicNode("Calm");
let energetic = new MusicNode("Energetic");
let melody = new MusicNode("Melody");
let beat = new MusicNode("BeatDrop");

root.children.push(calm, energetic);
calm.children.push(melody);
energetic.children.push(beat);

// ================= LINKED LIST =================
class ListNode {
    constructor(node) {
        this.node = node;
        this.next = null;
        this.prev = null;
    }
}

let head = null;
let currentNodeLL = null;

// ================= AUDIO =================
const soundMap = {
    "peace": "sounds/intro.mp3",
    "Calm": "sounds/calm.mp3",
    "Energetic": "sounds/energetic.mp3",
    "Melody": "sounds/melody.mp3",
    "BeatDrop": "sounds/beat.mp3"
};

let currentAudio = null;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// ================= DOM =================
const treeDiv = document.getElementById("tree");
const listDiv = document.getElementById("list");

// ================= RENDER TREE =================
function renderTree(node, parentDiv) {
    let div = document.createElement("div");
    div.className = "node";
    div.innerText = node.name;
    node.element = div;

    parentDiv.appendChild(div);

    if (node.children.length > 0) {
        let childContainer = document.createElement("div");
        parentDiv.appendChild(childContainer);

        node.children.forEach(child => {
            renderTree(child, childContainer);
        });
    }
}

renderTree(root, treeDiv);

// ================= GENERATE MUSIC =================
function generateMusic() {
    listDiv.innerHTML = "";

    let current = root;
    let prev = null;
    head = null;

    while (current) {
        let newNode = new ListNode(current);

        if (!head) head = newNode;

        if (prev) {
            prev.next = newNode;
            newNode.prev = prev;
        }

        prev = newNode;

        // UI list
        let listNode = document.createElement("div");
        listNode.className = "list-node";
        listNode.innerText = current.name;
        listDiv.appendChild(listNode);

        if (current.children.length === 0) break;

        let i = Math.floor(Math.random() * current.children.length);
        current = current.children[i];
    }

    currentNodeLL = head;
    highlightNode(currentNodeLL.node);
}

// ================= HIGHLIGHT =================
function highlightNode(activeNode) {
    document.querySelectorAll(".node").forEach(n => {
        n.classList.remove("active");
    });

    activeNode.element.classList.add("active");
}

// ================= PLAY =================
function playCurrent() {
    if (!currentNodeLL) return;

    let node = currentNodeLL.node;

    if (currentAudio) {
        currentAudio.pause();
    }

    currentAudio = new Audio(soundMap[node.name]);
    currentAudio.play();

    highlightNode(node);
    updateProgress();
}

// ================= PLAY / PAUSE =================
function togglePlay() {
    const btn = document.querySelector(".play-btn");

    if (!currentNodeLL) return;

    if (!isPlaying) {
        playCurrent();
        isPlaying = true;
        btn.innerText = "⏸";
    } else {
        currentAudio.pause();
        isPlaying = false;
        btn.innerText = "▶";
    }
}

// ================= NEXT =================
function nextSong() {
    if (!currentNodeLL) return;

    if (isShuffle) {
        // shuffle: random jump (breaks LL intentionally)
        let temp = head;
        let arr = [];
        while (temp) {
            arr.push(temp);
            temp = temp.next;
        }
        currentNodeLL = arr[Math.floor(Math.random() * arr.length)];
    } 
    else if (currentNodeLL.next) {
        currentNodeLL = currentNodeLL.next;
    } 
    else if (isRepeat) {
        currentNodeLL = head;
    }

    playCurrent();
}

// ================= PREVIOUS =================
function prevSong() {
    if (currentNodeLL && currentNodeLL.prev) {
        currentNodeLL = currentNodeLL.prev;
        playCurrent();
    }
}

// ================= SHUFFLE =================
function shuffle() {
    isShuffle = !isShuffle;
    alert("Shuffle: " + (isShuffle ? "ON" : "OFF"));
}

// ================= REPEAT =================
function repeat() {
    isRepeat = !isRepeat;
    alert("Repeat: " + (isRepeat ? "ON" : "OFF"));
}

// ================= PROGRESS =================
function updateProgress() {
    if (!currentAudio) return;

    let progress = document.getElementById("progress");

    currentAudio.ontimeupdate = () => {
        if (currentAudio.duration) {
            progress.value = (currentAudio.currentTime / currentAudio.duration) * 100;
        }
    };

    progress.oninput = () => {
        currentAudio.currentTime = (progress.value / 100) * currentAudio.duration;
    };
}

// ================= WAVE =================
function createWave() {
    const wave = document.getElementById("wave");
    wave.innerHTML = "";

    for (let i = 0; i < 41; i++) {
        let bar = document.createElement("div");
        bar.className = "bar";

        bar.style.height = (Math.random() * 80 + 20) + "%";
        bar.style.animationDelay = (i * 0.03) + "s";

        wave.appendChild(bar);
    }
}

createWave();
