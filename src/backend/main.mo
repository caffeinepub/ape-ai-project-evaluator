import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";

actor {
  include MixinStorage();

  // Initialize user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type CategoryScore = {
    category : Text;
    score : Nat;
    maxScore : Nat;
  };

  module CategoryScore {
    public func compare(categoryScore1 : CategoryScore, categoryScore2 : CategoryScore) : Order.Order {
      Text.compare(categoryScore1.category, categoryScore2.category);
    };
  };

  type Project = {
    id : Nat;
    userId : Principal;
    title : Text;
    description : Text;
    purpose : Text;
    techStack : Text;
    expectedOutput : Text;
    blobIds : [Text];
    status : { #pending; #evaluating; #evaluated; #failed };
    createdAt : Int;
  };

  module Project {
    public func compare(project1 : Project, project2 : Project) : Order.Order {
      Nat.compare(project1.id, project2.id);
    };
  };

  type Evaluation = {
    id : Nat;
    projectId : Nat;
    summary : Text;
    strengths : [Text];
    weaknesses : [Text];
    edgeCases : [Text];
    efficiencySuggestions : [Text];
    improvementSuggestions : [Text];
    scores : [CategoryScore];
    totalScore : Nat;
    maxTotalScore : Nat;
    createdAt : Int;
  };

  module Evaluation {
    public func compare(evaluation1 : Evaluation, evaluation2 : Evaluation) : Order.Order {
      Nat.compare(evaluation1.id, evaluation2.id);
    };
  };

  // Fixed: Use Nat as key for projects and evaluations
  let projects = Map.empty<Nat, Project>();
  let evaluations = Map.empty<Nat, Evaluation>();

  // Project counter
  var nextProjectId = 1;
  var nextEvaluationId = 1;

  // Submit a project for evaluation
  public shared ({ caller }) func submitProject(title : Text, description : Text, purpose : Text, techStack : Text, expectedOutput : Text, blobIds : [Text]) : async Nat {
    // Authorization: Only authenticated users can submit projects
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit projects");
    };

    let projectId = nextProjectId;
    nextProjectId += 1;

    let project : Project = {
      id = projectId;
      userId = caller;
      title;
      description;
      purpose;
      techStack;
      expectedOutput;
      blobIds;
      status = #pending;
      createdAt = Time.now();
    };

    projects.add(projectId, project);
    projectId;
  };

  // Get all projects for the caller
  public query ({ caller }) func getMyProjects() : async [Project] {
    // Authorization: Only authenticated users can view their projects
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };

    let userProjects = projects.values().filter(
      func(project) {
        project.userId == caller
      }
    ).toArray();
    userProjects.sort();
  };

  // Get specific project if owned by caller
  public query ({ caller }) func getProject(projectId : Nat) : async ?Project {
    // Authorization: Only authenticated users can view projects
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };

    // Ownership verification
    switch (projects.get(projectId)) {
      case (?project) {
        if (project.userId == caller) {
          ?project;
        } else {
          null;
        };
      };
      case (null) { null };
    };
  };

  // Get evaluation for a project if owned by caller
  public query ({ caller }) func getEvaluation(projectId : Nat) : async ?Evaluation {
    // Authorization: Only authenticated users can view evaluations
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view evaluations");
    };

    // Ownership verification: Check if caller owns the project
    switch (projects.get(projectId)) {
      case (?project) {
        if (project.userId == caller) {
          // Find evaluation for this project
          evaluations.values().find(
            func(evaluation) {
              evaluation.projectId == projectId
            }
          );
        } else {
          null;
        };
      };
      case (null) { null };
    };
  };

  // Trigger evaluation via Gemini
  public shared ({ caller }) func triggerEvaluation(projectId : Nat) : async () {
    // Authorization: Only authenticated users can trigger evaluations
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can trigger evaluations");
    };

    // Ownership verification
    let projectOpt = projects.get(projectId);
    switch (projectOpt) {
      case (null) { 
        Runtime.trap("Project not found");
      };
      case (?project) {
        if (project.userId != caller) {
          Runtime.trap("Unauthorized: You can only trigger evaluation for your own projects");
        };
        // Implementation would continue here with HTTP outcall
        // For now, just verify authorization
      };
    };
  };

  // Get all evaluations (admin only)
  public query ({ caller }) func getAllEvaluations() : async [Evaluation] {
    // Authorization: Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all evaluations");
    };
    
    let allEvaluations = evaluations.values().toArray();
    allEvaluations.sort();
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
