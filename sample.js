let modelNames = this["models"]
let modelNumber = 0;

AFRAME.registerComponent('handler', {
    init: function () {
        console.log("A-Frame handler init...")

        document.querySelector("a-scene").renderer.gammaOutput=true;
        document.querySelector("a-scene").renderer.outputEncoding = THREE.sRGBEncoding

        modelNumber = 1;
        createModel(modelNumber);
    }
});

let clock;
let stats;
window.onload = function() {
    console.log("window loaded...");

    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    Object.assign(stats.dom.style, {
        'position': 'fixed',
        'height': 'max-content',
        'left': 'auto',
        'right': 0,
    });
    document.body.appendChild( stats.dom );

    document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });

    let selectBtnModel = document.getElementById("modelNumber");
    modelNames.forEach(function(name, index) {
        let option = document.createElement('option');
        option.setAttribute('value', index);
        option.innerHTML = name;
        selectBtnModel.appendChild(option);
    });
    selectBtnModel.onchange = function (ev) {
        modelNumber = parseInt(document.getElementById("modelNumber").value, 10) + 1;
        console.log("Changed model: ", modelNumber)
        removeModel(modelNumber);
        createModel(modelNumber);
    }
    selectBtnModel.onkeydown = function (e) {
        if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "ArrowLeft" || e.key == "ArrowRight") {
            e.preventDefault();
        }
    }

    clock = new THREE.Clock();

    function render() {
        requestAnimationFrame(render);
    }
    render();
};


let model;
function createModel(modelNr){
    console.log("createModel: ", modelNr);

    let scene = document.querySelector('a-scene').object3D;

    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('./libs/draco/');
    loader.setDRACOLoader( dracoLoader );
    loader.load(
        // resource URL
        "./model/" + modelNames[modelNr-1],
        // called when the resource is loaded
        function ( gltf ){
            model = gltf.scene;
            model.name = "model"+String(modelNr);
            model.position.set(0,1,-2);
            model.rotation.set(0,0,0);
            model.scale.set(1.0, 1.0, 1.0);

            model.traverse( function ( child ) {
                if ( child.isMesh ) {
                    //console.log("isMesh...");
                    child.castShadow = true;
                }
            });

            scene.add(model);
        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has error
        function ( error ) {
            console.log('An error happened...');
            console.log(error);
        }
    );
}

function removeModel(modelNr){
    console.log("removeModel:", modelNr);

    let scene = document.querySelector('a-scene').object3D;
    scene.remove(model);
    disposeObjects(model);
    
}

function disposeObjects(model){
    console.log("disposeObjects...");

    model.traverse(obj => {
        if(obj.material){
            if(obj.material.map){
                obj.material.map.dispose();
            }
            if(obj.material.lightMap){
                obj.material.lightMap.dispose();
            }
            if(obj.material.aoMap){
                obj.material.aoMap.dispose();
            }
            if(obj.material.emissiveMap){
                obj.material.emissiveMap.dispose();
            }
            if(obj.material.bumpMap){
                obj.material.bumpMap.dispose();
            }
            if(obj.material.normalMap){
                obj.material.normalMap.dispose();
            }
            if(obj.material.displacementMap){
                obj.material.displacementMap.dispose();
            }
            if(obj.material.roughnessMap){
                obj.material.roughnessMap.dispose();
            }
            if(obj.material.metalnessMap){
                obj.material.metalnessMap.dispose();
            }
            if(obj.material.alphaMap){
                obj.material.alphaMap.dispose();
            }
            if(obj.material.envMap){
                obj.material.envMap.dispose();
            }
            obj.material.dispose();
        }
        if(obj.geometry){
            obj.geometry.dispose();
            //console.log("obj.geometry.dispose()...");
        }
        if(obj.texture){
            obj.texture.dispose();
            //console.log("obj.texture.dispose()...");
        }
    });
}
