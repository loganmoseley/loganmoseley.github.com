/*	****** BETA *** April 24, 2009 ******
	Player.js
		Controls all player movement, input, sound, GUI, and animation.

	Player lead programmer:		Logan Moseley
	Player also developed by:	Andrew Dolce, Michael 'Z' Goddard, Kyle Okaly
	
	"Faye's Shift"
		Programming:	Andrew Dolce, Michael 'Z' Goddard, Logan Moseley, Kyle Okaly
		Sound/Music:	Greg Lane, Kyle Okaly
		Art:			Robert Baldwin
*/

// GUI Textures
private var hpIcon : Texture;						// hpIcon and hpTextures. Initialized in Player (prefab).
var hpTextures : Texture[];

// Sounds
var phaseSound : AudioClip;							// Sound var for Faye's action 'Phase'. Initialized in Player (prefab).
var hurtSound : AudioClip;								// Sound var for Faye getting hurt. Initialized in Player (prefab).
var deathSound : AudioClip;							// Sound var for Faye dying. Initialized in Player (prefab).

// Movement / Physics
// private var gravity = Physics.gravity;					// Possibly use custom gravity.
var maxVelocity = 8.0;									// Horizontal running speed.
private var targetVel = 0.0;							// Temp horiz run speed, based on user input.
private var terminalVelocityY = -15.0;			// Max falling speed
var jumpSpeed = 1.05;									// Velocity force to be added to player rigid body.
var jumpDur = 0.2;										// Duration jumpSpeed is added to player rigid body.
private var doJump : boolean = false;			// Is MovementTick( ) allowed to make player jump?
private var jumpTime = 0.0;							// Current time + jumpDur.
var stickDur = 0.5;										// Duration player is allowed to stick to (hang from) the ceiling.
private var endStickTime;							// Current time + stickDur.
private var movement : Vector3;					// Used in MovementTick( ) for player rigid body: horiz + vert movement forces.
private var haveHitWall : boolean = false;		// Stops player from sticking to the wall (and wall isJumping).
private var anyHitGround : boolean = false;	// Protects against multiple-point collisions involving a wall and the ground.

private var canBeDamaged : boolean = true;	// Helper var to time-restrict damage after taking some (0.5 seconds).
var undamageableTime : float = 0.5;				// Time span in which player cannot take damage.

private var isgrounded : boolean;					// (isGrounded reserved)
private var isRiding : boolean = false;			// Is riding a Yeti?
private var isJumping : boolean = false;		// Is jumping (in the air && pressed jump to get there)?

// Knockback (potential collision reaction)
private var horizontalSpeed = 0.0;				// Player's horiz speed: used to move in MovementTick( )
private var verticalSpeed = 0.0;					// Player's vert speed: used to move in MovementTick( )
private var horizontalSpeedBase = 0.0;			// Used for knockback, ApplyFriction( ). Depricated atm.
private var verticalSpeedBase = 0.0;				// Used for knockback, ApplyFriction( ). Depricated atm.
private var xKnockback = 0.0;						// Knockback speed. Helper to KnockbackX( ).


// Phasing
private var FailedTempPhase : boolean = false;				// Protect against phasing out of home phase at the wrong time.
private var AttemptTempPhaseReturn : boolean = false;	// Is Player trying to return to current home phase?
var playerShadow : GameObject;									// Player instantiates its own playerShadow (prefab).
var playerCamera : GameObject;									// Player instantiates its own PlayerCamera (prefab).
private var phasingAllowed : boolean = true;					// Is Player allowed to phase? (Before she knows about it, when talking, ...)

// Platforming
var hp: int = 10;															// Current health.
var maxHP: int = 10;													// Max (clamped to) health.
private var checkpoint : Vector3;									// Death checkpoint is most recent encountered (irrespective of progress).
private var grabbing : GameObject;								// GameObject currently being grabbed.
private var grabTarget : GameObject;							// Potential 'grabbing' object.
private var facing: Direction = Direction.left;					// Current facing [left, right].
private var groundedFacing : Direction = Direction.left;		// 'facing' when player left the ground: used in MovementTick( ).

@script RequireComponent(Rigidbody)								// Require a rigidbody to be attached to the same game object.

// -------------------------------------------
// Input state machine.
// 		Set when interacting with NPCs.
//		Affects movement.
// -------------------------------------------
enum InputState {Normal, Monologue, DialogueStart, Dialogue};
var inputState : InputState = InputState.Normal;
var lastInputStateTrigger : GameObject;
class InputStateTuple {
    var state : InputState;
    var trigger : GameObject;

    function InputStateTuple(state : InputState, trigger : GameObject) {
        this.state = state; this.trigger = trigger;
    }
}

function SetInputState (inputStateTuple : InputStateTuple) {
	inputState = inputStateTuple.state;
	lastInputStateTrigger = inputStateTuple.trigger;
	if (inputState < 3)
		phasingAllowed = true;
	else
		phasingAllowed = false;
}

// -------------------------------------------
// Movement state machine.
// 		Set when interacting with world.
//		Affects animations.
// -------------------------------------------
enum MovementState {Idle, Running, isJumping, Grabbing, Throwing, Dying};
var movementState : MovementState = MovementState.Idle;

function SetMovementState (movementState : MovementState) {
	this.movementState = movementState;
}


// Player gameObject init.
function Start () {
	// Protect against multiple Player gameObjects in the scene. Necessary due to LevelLoader.
	for (var player : Player in GameObject.FindObjectsOfType(Player)) {
		if (player !== GetComponent(Player)) {
			Destroy(gameObject);
			return;
		}
	}
	
	playerShadow = Instantiate(playerShadow);					// Instantiate gameObject from prefab.
	playerCamera = Instantiate(playerCamera);					// Instantiate gameObject from prefab.
	checkpoint = transform.position;									// Init checkpoint to init position.
	transform.renderer.material.color = Color.red;
	playerShadow.transform.renderer.material.color = Color.black;
	rigidbody.freezeRotation = true;	
}

// Occurs at physics update time.
function FixedUpdate () {
	HandleInput_Jump();
	MovementTick();	
	UpdateFacing();
	CheckLanding();
	AutoSetState();
	
	// isgrounded = false;
}

// Necessarily occurs after FixedUpdate( )
function Update () {
	HandleInput_TogglePhase();
	HandleInput_TempPhase();

	if(!grabbing){
		grabTarget = GrabTargetCheck();
	}
	HandleInput_Grab();
	
	playerShadow.transform.position = transform.position + Vector3.forward * (GetComponent(Phase).phase == 0 ? -10 : 10);
	playerShadow.transform.rotation = transform.rotation;
}


//-------------------------------------------
//	Phasing functions
//-------------------------------------------
// If Player tries to phase and fails
function PhaseFailed () {
	FailedTempPhase = true;
	var explosion : GameObject = GameObject.Find("Phase Fail Particle Explosion");
	if (explosion) {
		explosion.transform.position = playerShadow.transform.position;
		explosion.transform.GetComponent("ParticleEmitter").Emit(50);
	}
}

// If Player tries to phase and succeeds
function PhaseComplete () {
	AttemptTempPhaseReturn = false;			// (No longer attempting.)
	FailedTempPhase = false;
	AudioSource.PlayClipAtPoint(phaseSound, transform.position, 1.0);
	
/*	if (transform.position.z > 0)
		transform.renderer.material.color = Color.red;
	else
		transform.renderer.material.color = Color.blue; */
}


//-------------------------------------------------------
//	Object/Enemy interaction functions
//-------------------------------------------------------
// Called every update. Looks for best possible grabTarget
function GrabTargetCheck (){
	var dir: Vector3;
	if(facing == Direction.right){
		dir = Vector3.right;
	}
	else if(facing == Direction.left){
		dir = -Vector3.right;
	}
	var hitInfo: RaycastHit;
	if (Physics.Raycast (transform.position + Vector3(0, -0.1, 0), dir, hitInfo, 1.5)){
		//print ("OBJECT IN RANGE" + hitInfo.collider.gameObject.name);
		return hitInfo.collider.gameObject;
	}
	else{
		//print ("NOT IN RANGE");
		return null;
	}
}

// Called in response to user input
function Grab () {
	if (!grabbing) {
		//print(grabTarget);
		if(grabTarget != null){
			grabTarget.SendMessage("Grab", gameObject, SendMessageOptions.DontRequireReceiver);		// Tell the object it's being grabbed
		}
	}
	else
		grabbing.SendMessage("Release", gameObject);
}

// Player grabs Obj.
function Attach (obj : GameObject) {
	if (grabbing) {
		Debug.Log("Trying to attach Object while player already has grabbed object.");
	} else {
		//print("attached");
		grabbing = obj;
		obj.transform.parent = transform;					// Make obj child of Player
		Physics.IgnoreCollision(gameObject.collider, obj.collider, true);				// Ignore Player-obj collisions
		gameObject.SendMessage("BlendGrab", 1, SendMessageOptions.DontRequireReceiver);		// Player grab animation
		playerShadow.SendMessage("BlendGrab", 1, SendMessageOptions.DontRequireReceiver);
        // for (var col : Collider in obj.GetComponentsInChildren(Collider)) {
        //     Physics.IgnoreCollision(collider, col);
        // }
		
		// update the rigidbody with the shapes currently under it.
        // for (var col : Collider in GetComponents(Collider) + GetComponentsInChildren(Collider)) {
        //     col.isTrigger = !col.isTrigger;
        //     col.isTrigger = !col.isTrigger;
        // }
        // 
        // Destroy(rigidbody);
        // gameObject.AddComponent(Rigidbody);
	}
}

// Player releases (from grabbing) Obj
function Detach (obj : GameObject) {
	if (grabbing == obj) {
		//print("detached");
		grabbing.transform.parent = null; //transform.root;		// Deparent obj (grabbed gameObject)
		if(grabbing.tag == "Lizard" && Mathf.Abs(rigidbody.velocity.x) > 0.1){		// Kick the Lizard to let go.
			grabbing.SendMessage("KnockBack", Vector2((facing == Direction.left)? -10: 10, 2));
		}
		grabbing = null;
		Physics.IgnoreCollision(gameObject.collider, obj.collider, false);		// Un-ignore Player-obj collisions
		gameObject.SendMessage("BlendGrab", 0, SendMessageOptions.DontRequireReceiver);		// Player reverse grab animation
		playerShadow.SendMessage("BlendGrab", 0, SendMessageOptions.DontRequireReceiver);	// Player shadow reverse grab animation
		gameObject.SendMessage("PlayThrow", SendMessageOptions.DontRequireReceiver);		// Player throw animation
		playerShadow.SendMessage("PlayThrow", SendMessageOptions.DontRequireReceiver);		// Player shadow throw animation
		// stop ignoring those colliders
        // for (var col : Collider in obj.GetComponentsInChildren(Collider)) {
        //  Physics.IgnoreCollision(collider, col, false);
        // }
		
		// update the rigidbody with the shapes currently under it.
        // for (var col : Collider in GetComponents(Collider) + GetComponentsInChildren(Collider)) {
        //     col.isTrigger = !col.isTrigger;
        //     col.isTrigger = !col.isTrigger;
        // }
        // 
        // Destroy(rigidbody);
        // gameObject.AddComponent(Rigidbody);
	} else {
		Debug.Log("Told to detach with nothing attached.");
	}
}

// Obj takes control of Player movement (start riding)
function ControlMovement (obj : GameObject) {
	if (!grabbing) {
		grabbing = obj;
		transform.parent = obj.transform;
		transform.localPosition = Vector3( -1, 1 ,0);// -0.5 * obj.transform.localScale.x, 0.5, 0);
		isRiding = true;
		rigidbody.isKinematic = true;
		Physics.IgnoreCollision(collider, obj.collider, true);
		gameObject.SendMessage("BlendGrab", 1, SendMessageOptions.DontRequireReceiver);
		playerShadow.SendMessage("BlendGrab", 1, SendMessageOptions.DontRequireReceiver);
	}
}

// Obj releases control of Player movement (stop riding)
function ReleaseMovement (obj : GameObject) {
	transform.parent = null; //transform.root;
	isRiding = false;
	rigidbody.isKinematic = false;
	Physics.IgnoreCollision(collider, obj.collider, false);
	gameObject.SendMessage("BlendGrab", 0, SendMessageOptions.DontRequireReceiver);
	playerShadow.SendMessage("BlendGrab", 0, SendMessageOptions.DontRequireReceiver);
	if (grabbing) {
		grabbing = null;
	}
}

// Called when Player collides with an enemy
function KnockBack (vel: Vector2){ //dir: Direction){
	//print("KNOCKED " + vel);
	//horizontalSpeedBase = vel.x;
	//verticalSpeedBase = vel.y;
	rigidbody.AddForce(Vector3(0, vel.y, 0), ForceMode.VelocityChange);
	xKnockback = vel.x;
	Invoke("KnockBackX", 0.01);
	this.SetMovementState(MovementState.Idle);
	/*
	if(dir == Direction.left){
		horizontalSpeedBase = -5;
	}
	else{
		horizontalSpeedBase = 5;
	}
	verticalSpeedBase = 3;
	*/
}

// Helper function to KnockBack( ) (invoked 0.01 seconds later)
function KnockBackX (){
	//print("KNOCKEDX " + xKnockback);
	rigidbody.AddForce(Vector3(xKnockback,0,0), ForceMode.VelocityChange);
}

// Hot particles (fire, lava, ...) call this on collided gameObjects.
// isDamaging: (Fire || Lava) do damage; (other) do nothing for now
function Heat (obj : GameObject) {
	if (grabbing && grabbing.tag == "Pipe") return;
	if ((obj.GetComponent("Pipeable").type == "Fire" ||
		obj.GetComponent("Pipeable").type == "Lava") &&
		canBeDamaged) {
		canBeDamaged = false;
		ChangeHP(-1);
		Invoke("UnrestrictDamage", undamageableTime);
	}
}

// Cool particles (ice, water, ...) call this on collided gameObjects.
// isDamaging: (Ice) do damage; (other) do nothing for now
function Chill (obj : GameObject) {
	if (grabbing && grabbing.tag == "Pipe") return;
	if (obj.GetComponent("Pipeable").type == "Ice" &&
		canBeDamaged) {
		ChangeHP(-1);
		canBeDamaged = false;
		Invoke("UnrestrictDamage", undamageableTime);
	}
}

// Invoked undamageableTime seconds after Player is damaged.
function UnrestrictDamage () {
	canBeDamaged = true;
}


//-----------------------------------
//	Platforming functions
//-----------------------------------
// Set checkpoint to new checkpoint, irrespective of progress.
function Checkpoint (newCheckpoint : Vector3) {
	checkpoint = newCheckpoint;
}

// Healing comes in positive, damage negative.
function ChangeHP (change: int){
	hp += change;
	
	// Player is dead
	if(hp <= 0){
		AudioSource.PlayClipAtPoint(deathSound, transform.position, 1.0);
		transform.position = checkpoint;
		hp = maxHP;
		rigidbody.velocity = Vector3.zero;
	}
	else {
		AudioSource.PlayClipAtPoint(hurtSound, transform.position, 1.0);
		hp = Mathf.Min(hp, maxHP);					// Clamp hp to maxHP or lower.
	}
}

// Wrapper for easy killing.
function Kill () {
	ChangeHP(-hp);
}


//----------------------------------
//	Movement functions
//----------------------------------
// Called every FixedUpdate( )
function MovementTick () {
	var xInput = 0;					// +/- 1, according to right/left user input state.
	if (inputState < 3) {			// Dialogue disables movement input (Normal, Monologue, and DialogueStart allow movement)
		xInput = Input.GetAxis("Horizontal");
	}
	
	if(xInput > 0)						// If input right
		targetVel = maxVelocity;
	else if(xInput < 0)				// input left
		targetVel = -maxVelocity;
	else									// input standing
		targetVel = 0;
	
	var wallCorrection = false;
	if (haveHitWall) {
		if ((facing == Direction.left && Input.GetAxis("Horizontal") < 0) ||
			(facing == Direction.right && Input.GetAxis("Horizontal") > 0)){
			targetVel = 0;
			//print("wall correction");
			wallCorrection = true;
		}
	}
	
	if(xInput < 0){
		facing = Direction.left;
		transform.eulerAngles = Vector3(0, 180, 0);
	}
	else if(xInput > 0){
		facing = Direction.right;
		transform.eulerAngles = Vector3(0, 0, 0);
	}
	
	// verticalSpeed = doJump ? verticalSpeed + jumpSpeed : 0;
	var xForce = (targetVel - rigidbody.velocity.x) * ((isgrounded || wallCorrection)?1:0.03);// * Time.deltaTime;
	if(xForce > 1) xForce = 1;
	else if(xForce < -1) xForce = -1;
	//print("xForce " + xForce);
	movement = Vector3 (xForce, 0, 0);
	
	rigidbody.AddForce (Vector3.up * (doJump && jumpSpeed+rigidbody.velocity.y<10 ? jumpSpeed: 0), ForceMode.VelocityChange);
	
	//ApplyFriction();
	if (!isRiding) {
		rigidbody.AddForce (movement, ForceMode.VelocityChange);
		if(isgrounded){
			p = Mathf.Min(Mathf.Abs(rigidbody.velocity.x) / maxVelocity, 1.0);
			gameObject.SendMessage("BlendWalk", p, SendMessageOptions.DontRequireReceiver);
			playerShadow.SendMessage("BlendWalk", p, SendMessageOptions.DontRequireReceiver);
		}
		else{
			gameObject.SendMessage("PlayAir", SendMessageOptions.DontRequireReceiver);
			playerShadow.SendMessage("PlayAir", SendMessageOptions.DontRequireReceiver);
		}
	}
	else{
		//gameObject.SendMessage("PlayRide", SendMessageOptions.DontRequireReceiver);
		p = Mathf.Min(Mathf.Abs(grabbing.rigidbody.velocity.x) / maxVelocity, 1.0);
		gameObject.SendMessage("BlendRide", p, SendMessageOptions.DontRequireReceiver);
		playerShadow.SendMessage("BlendRide", p, SendMessageOptions.DontRequireReceiver);
	}
}

// Take care of animation state.
function AutoSetState () {	
	if (Mathf.Abs(horizontalSpeed))
		this.SetMovementState(MovementState.Running);
	else
		this.SetMovementState(MovementState.Idle);
		
	if (!isgrounded)
		this.SetMovementState(MovementState.isJumping);
	if (isRiding)
		this.SetMovementState(MovementState.Idle);
	if (grabbing)
		this.SetMovementState(MovementState.Grabbing);
}

// Called in response to user input
function Jump () {
	// Jumping take-off
	if (isgrounded || isRiding) {
		//~ print("Jump function");
		if(isRiding){
			grabbing.SendMessage("Release", gameObject);
		}
		isJumping = true;
		doJump = true;
		groundedFacing = facing;
		jumpTime = Time.time + jumpDur;
		SendMessage("DidJump", SendMessageOptions.DontRequireReceiver);
	}
	
	// Continue to apply jump forces for jumpTime
	else if (Time.time < jumpTime) {
		isJumping = true;
		doJump = true;
	}
	
	// Else ignore input
	else {
		doJump = false;
		// jumpTime = Time.time;
	}
}

// Called every FixedUpdate( ). Air -> ground transition.
function CheckLanding () {
	if (isgrounded && isJumping) {
		// print("Landed");
		isJumping = false;
		verticalSpeed = 0;
		SendMessage("DidLand", SendMessageOptions.DontRequireReceiver);
	}
}

// Called every FixedUpdate( ). facing for jumping, grabbing, and wallCorrection.
function UpdateFacing () {
	if(horizontalSpeed > 0 && facing == Direction.left){
		facing = Direction.right;
		transform.eulerAngles = Vector3(0, 0, 0);
	}
	else if(horizontalSpeed < 0 && facing == Direction.right){
		facing = Direction.left;
		transform.eulerAngles = Vector3(0, 180, 0);
	}
}


//--------------------------------
//	Physics functions
//--------------------------------
function ApplyFriction () {
	if(Mathf.Abs(horizontalSpeedBase) <= 0.1){
		horizontalSpeedBase = 0.0;
	}
	else{
		if(horizontalSpeedBase > 0){
			horizontalSpeedBase -= 0.1;
		}
		else if(horizontalSpeedBase < 0){
			horizontalSpeedBase += 0.1;
		}
	}
	if(Mathf.Abs(verticalSpeedBase) <= 0.1){
		verticalSpeedBase = 0.0;
	}
	else{
		if(verticalSpeedBase > 0){
			verticalSpeedBase -= 0.1;
		}
		else if(verticalSpeedBase < 0){
			verticalSpeedBase += 0.1;
		}
	}
}

// Helper function: Check if grounded.
function GroundCheck (){
	var x = 0.5 * GetComponent("BoxCollider").size.x; //transform.localScale.x;
	var y = 0.5 * GetComponent("BoxCollider").size.y; //transform.localScale.y;
	var ignore: LayerMask = ~(1 << gameObject.layer); // & ~(1 << 2);
	//print(ignore.value);
	return Physics.CheckCapsule (transform.position + Vector3(-x,-y,0), transform.position + Vector3(x,-y,0), 0.1, ignore.value);
}

function OnCollisionEnter (collision : Collision) {
	endStickTime = Time.time + stickDur;				// Ceiling-hanging
}
 
function OnCollisionStay (collision : Collision) {
	if(collision.gameObject.tag == "Lizard" || collision.gameObject.tag == "Yeti" || collision.gameObject.tag == "Pipeable")
		return;
	anyHitGround = false;
	for (var contact : ContactPoint in collision.contacts) {
		if (contact.normal.y > 0.1) {
			isgrounded = true;
			anyHitGround = true;
		}
		else if (contact.normal.y < -0.1) {
			//print("Ceiling");
			if (endStickTime <= Time.time) {
				isgrounded = false;
				anyHitGround = false;
			}
			else {
				isgrounded = true;
				anyHitGround = true;
			}
		}
		else if (Mathf.Abs(contact.normal.x) > 0.5) {
			rigidbody.velocity.x = 0;
		}
	}
	
	if (anyHitGround)
		haveHitWall = false;
	else
		haveHitWall = true;
}

function OnCollisionExit ()
{
	haveHitWall = false;
	isgrounded = false;
	isJumping = true;
}


//------------------------------
//	Input functions
//------------------------------
function HandleInput_Jump () {
	if (Input.GetButton("Jump")) {
		if (!inputState)		// Normal input state only.
			Jump();
		else
			if (lastInputStateTrigger)
				lastInputStateTrigger.SendMessage("CancelText");
	}
	else
		doJump = false;
}

function HandleInput_TogglePhase () {
	if (Input.GetButtonDown("PhasePerm") && phasingAllowed) {
		if (grabbing) {
			if (gameObject.GetComponent(Phase).CanPhase([gameObject, grabbing])) {
				grabbing.SendMessage("DoPhase");
				SendMessage("ChangePhase");
			}
		} else {
			if (gameObject.GetComponent(Phase).CanPhase([gameObject]))
				SendMessage("ChangePhase");
		}
	}
}

function HandleInput_TempPhase () {
	if (Input.GetButtonDown("PhaseTemp") && phasingAllowed) {
		if (grabbing) {
			if (gameObject.GetComponent(Phase).CanPhase([gameObject, grabbing])) {
				grabbing.SendMessage("DoPhase");
				SendMessage("ChangePhase");
			}
		} else {
			if (gameObject.GetComponent(Phase).CanPhase([gameObject]))
				SendMessage("ChangePhase");
		}
	}
	if (Input.GetButtonUp("PhaseTemp")){
		if (FailedTempPhase)
			FailedTempPhase = false;
		else
			AttemptTempPhaseReturn = true;
	}	
	if (AttemptTempPhaseReturn) {
		if (grabbing) {
			if (gameObject.GetComponent(Phase).CanPhase([gameObject, grabbing])) {
				grabbing.SendMessage("DoPhase");
				SendMessage("ChangePhase");
			}
		} else {
			// print("Attempting Temp Phase Return");
			if (gameObject.GetComponent(Phase).CanPhase([gameObject])) {
				SendMessage("ChangePhase");
				AttemptTempPhaseReturn = false;
			}
		}
	}
}

function HandleInput_Grab () {
	if (Input.GetButtonDown("Grab")) {
		if (!inputState) {			// Only Normal input state allowed to grab.
			Grab();
		}
		else {	
			if (lastInputStateTrigger) {
				lastInputStateTrigger.SendMessage("NextText");
				if (inputState == InputState.DialogueStart)
					inputState = InputState.Dialogue;
			}
		}
	}
}


//-------------------------------------------
//	Return variable functions
//-------------------------------------------
function GetSpeed () {
	return Vector3(horizontalSpeed, verticalSpeed, 0);
}

function GetLoc () {
	return transform.position;
}

function IsisJumping () {
	return isJumping;
}

function IsisRiding () {
	return isRiding;
}

function GetDirection () {
	return horizontalSpeed;
}


//--------------------------------
//	GUI function (HP)
//--------------------------------
function OnGUI () {
	if (hp <= hpTextures.length && hp > 0) {
		hpIcon = hpTextures[hp-1];
	}
	GUI.Box (Rect (0,0,75,75), hpIcon, GUIStyle.none);
}
