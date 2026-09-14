/**
 * ExamTrack - Initial Seed Data
 * Pre-populated with realistic college/school engineering subjects and topics
 */

window.ExamTrackData = {
  currentUser: {
    name: "Alex Rivera",
    email: "alex.rivera@student.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    institution: "Institute of Technology",
    major: "Computer Science & Engineering",
    semester: "Semester 5"
  },
  
  settings: {
    theme: "light", // "light" | "dark"
    soundEnabled: true,
    dailyGoalHours: 4.5,
    notificationsEnabled: true
  },

  subjects: [
    {
      id: "sub-1",
      name: "DBMS",
      fullName: "Database Management Systems",
      code: "CS-501",
      color: "indigo", // indigo, purple, blue, emerald, amber, rose
      examDate: "2026-09-26", // 12 days from 2026-09-14
      examTime: "10:00 AM - 01:00 PM",
      priority: "High",
      targetGrade: "A+",
      studyHours: 14.5,
      topics: [
        {
          id: "top-1-1",
          name: "Introduction to DBMS",
          status: "Completed", // "Not Started" | "In Progress" | "Completed"
          difficulty: "Easy", // "Easy" | "Medium" | "Hard"
          estimatedHours: 1.5,
          actualHours: 2.0,
          revisionCount: 3,
          lastRevised: "2026-09-11"
        },
        {
          id: "top-1-2",
          name: "Database Architecture",
          status: "Completed",
          difficulty: "Medium",
          estimatedHours: 2.0,
          actualHours: 2.5,
          revisionCount: 2,
          lastRevised: "2026-09-12"
        },
        {
          id: "top-1-3",
          name: "ER Model",
          status: "In Progress",
          difficulty: "Medium",
          estimatedHours: 3.0,
          actualHours: 2.0,
          revisionCount: 1,
          lastRevised: "2026-09-13"
        },
        {
          id: "top-1-4",
          name: "Normalization",
          status: "Not Started",
          difficulty: "Hard",
          estimatedHours: 4.0,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-1-5",
          name: "SQL & Query Optimization",
          status: "Not Started",
          difficulty: "Medium",
          estimatedHours: 3.5,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-1-6",
          name: "Transaction Processing & Concurrency Control",
          status: "Not Started",
          difficulty: "Hard",
          estimatedHours: 4.0,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-1-7",
          name: "Indexing, B-Trees & Hashing",
          status: "Not Started",
          difficulty: "Hard",
          estimatedHours: 3.0,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-1-8",
          name: "Crash Recovery & Logging",
          status: "Not Started",
          difficulty: "Medium",
          estimatedHours: 2.5,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        }
      ]
    },
    {
      id: "sub-2",
      name: "Java Programming",
      fullName: "Object-Oriented Programming with Java",
      code: "CS-502",
      color: "purple",
      examDate: "2026-09-30", // 16 days
      examTime: "02:00 PM - 05:00 PM",
      priority: "High",
      targetGrade: "A",
      studyHours: 11.0,
      topics: [
        {
          id: "top-2-1",
          name: "Classes, Objects & Encapsulation",
          status: "Completed",
          difficulty: "Easy",
          estimatedHours: 2.0,
          actualHours: 2.0,
          revisionCount: 2,
          lastRevised: "2026-09-08"
        },
        {
          id: "top-2-2",
          name: "Inheritance & Polymorphism",
          status: "Completed",
          difficulty: "Medium",
          estimatedHours: 2.5,
          actualHours: 3.0,
          revisionCount: 2,
          lastRevised: "2026-09-09"
        },
        {
          id: "top-2-3",
          name: "Exception Handling",
          status: "In Progress",
          difficulty: "Medium",
          estimatedHours: 2.0,
          actualHours: 1.5,
          revisionCount: 1,
          lastRevised: "2026-09-13"
        },
        {
          id: "top-2-4",
          name: "Java Collections Framework",
          status: "Completed",
          difficulty: "Hard",
          estimatedHours: 4.5,
          actualHours: 4.5,
          revisionCount: 2,
          lastRevised: "2026-09-10"
        },
        {
          id: "top-2-5",
          name: "Multithreading & Synchronization",
          status: "Not Started",
          difficulty: "Hard",
          estimatedHours: 4.0,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-2-6",
          name: "Streams API & Lambda Expressions",
          status: "Not Started",
          difficulty: "Medium",
          estimatedHours: 2.5,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        }
      ]
    },
    {
      id: "sub-3",
      name: "Computer Networks",
      fullName: "Data Communications & Computer Networks",
      code: "CS-503",
      color: "blue",
      examDate: "2026-10-04", // 20 days
      examTime: "10:00 AM - 01:00 PM",
      priority: "Medium",
      targetGrade: "A",
      studyHours: 7.5,
      topics: [
        {
          id: "top-3-1",
          name: "OSI Model & TCP/IP Protocol Suite",
          status: "In Progress",
          difficulty: "Medium",
          estimatedHours: 3.0,
          actualHours: 2.5,
          revisionCount: 1,
          lastRevised: "2026-09-12"
        },
        {
          id: "top-3-2",
          name: "Data Link Layer & Error Detection (CRC)",
          status: "Completed",
          difficulty: "Medium",
          estimatedHours: 3.0,
          actualHours: 3.0,
          revisionCount: 2,
          lastRevised: "2026-09-07"
        },
        {
          id: "top-3-3",
          name: "IP Addressing & Subnetting (IPv4/IPv6)",
          status: "Completed",
          difficulty: "Hard",
          estimatedHours: 4.0,
          actualHours: 4.0,
          revisionCount: 3,
          lastRevised: "2026-09-10"
        },
        {
          id: "top-3-4",
          name: "Routing Algorithms (Dijkstra, Distance Vector)",
          status: "Not Started",
          difficulty: "Hard",
          estimatedHours: 3.5,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-3-5",
          name: "Transport Layer: TCP Flow & Congestion Control",
          status: "Not Started",
          difficulty: "Hard",
          estimatedHours: 4.0,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-3-6",
          name: "DNS, HTTP/HTTPS, and Network Security",
          status: "Not Started",
          difficulty: "Medium",
          estimatedHours: 2.5,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        }
      ]
    },
    {
      id: "sub-4",
      name: "Linux & Shell Programming",
      fullName: "Unix/Linux Systems & Shell Scripting",
      code: "CS-504",
      color: "emerald",
      examDate: "2026-10-09", // 25 days
      examTime: "02:00 PM - 05:00 PM",
      priority: "Medium",
      targetGrade: "A+",
      studyHours: 5.0,
      topics: [
        {
          id: "top-4-1",
          name: "Linux Kernel Architecture & File Hierarchy",
          status: "Completed",
          difficulty: "Easy",
          estimatedHours: 2.0,
          actualHours: 2.0,
          revisionCount: 2,
          lastRevised: "2026-09-06"
        },
        {
          id: "top-4-2",
          name: "Basic Shell Commands & File Permissions (chmod, chown)",
          status: "Completed",
          difficulty: "Easy",
          estimatedHours: 1.5,
          actualHours: 1.5,
          revisionCount: 3,
          lastRevised: "2026-09-09"
        },
        {
          id: "top-4-3",
          name: "Process Management & Signals",
          status: "In Progress",
          difficulty: "Medium",
          estimatedHours: 2.5,
          actualHours: 1.5,
          revisionCount: 1,
          lastRevised: "2026-09-14"
        },
        {
          id: "top-4-4",
          name: "Bash Scripting, Loops, and Conditionals",
          status: "Not Started",
          difficulty: "Medium",
          estimatedHours: 3.0,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-4-5",
          name: "Grep, Sed, Awk & Text Processing",
          status: "Not Started",
          difficulty: "Hard",
          estimatedHours: 3.5,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        }
      ]
    },
    {
      id: "sub-5",
      name: "Data Structures",
      fullName: "Advanced Data Structures & Algorithms I",
      code: "CS-505",
      color: "amber",
      examDate: "2026-10-14", // 30 days
      examTime: "10:00 AM - 01:00 PM",
      priority: "High",
      targetGrade: "A+",
      studyHours: 12.0,
      topics: [
        {
          id: "top-5-1",
          name: "Arrays, Linked Lists & Doubly Linked Lists",
          status: "Completed",
          difficulty: "Easy",
          estimatedHours: 2.5,
          actualHours: 3.0,
          revisionCount: 3,
          lastRevised: "2026-09-05"
        },
        {
          id: "top-5-2",
          name: "Stacks & Queues (Applications & Evaluation)",
          status: "Completed",
          difficulty: "Easy",
          estimatedHours: 2.0,
          actualHours: 2.0,
          revisionCount: 2,
          lastRevised: "2026-09-08"
        },
        {
          id: "top-5-3",
          name: "Binary Trees & BST Operations",
          status: "Completed",
          difficulty: "Medium",
          estimatedHours: 3.5,
          actualHours: 4.0,
          revisionCount: 2,
          lastRevised: "2026-09-11"
        },
        {
          id: "top-5-4",
          name: "AVL Trees & Red-Black Trees Balancing",
          status: "In Progress",
          difficulty: "Hard",
          estimatedHours: 4.0,
          actualHours: 3.0,
          revisionCount: 1,
          lastRevised: "2026-09-13"
        },
        {
          id: "top-5-5",
          name: "Heaps & Priority Queues",
          status: "Not Started",
          difficulty: "Medium",
          estimatedHours: 2.5,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-5-6",
          name: "Graph Representations & Traversals (BFS/DFS)",
          status: "Not Started",
          difficulty: "Hard",
          estimatedHours: 4.0,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-5-7",
          name: "Hash Tables & Collision Resolution",
          status: "Not Started",
          difficulty: "Medium",
          estimatedHours: 2.5,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        }
      ]
    },
    {
      id: "sub-6",
      name: "Design & Analysis of Algorithms",
      fullName: "Design and Analysis of Computer Algorithms",
      code: "CS-506",
      color: "rose",
      examDate: "2026-10-19", // 35 days
      examTime: "02:00 PM - 05:00 PM",
      priority: "High",
      targetGrade: "A+",
      studyHours: 8.0,
      topics: [
        {
          id: "top-6-1",
          name: "Asymptotic Notations & Recurrence Relations",
          status: "Completed",
          difficulty: "Easy",
          estimatedHours: 2.0,
          actualHours: 2.0,
          revisionCount: 3,
          lastRevised: "2026-09-04"
        },
        {
          id: "top-6-2",
          name: "Divide and Conquer (MergeSort, QuickSort Analysis)",
          status: "Completed",
          difficulty: "Medium",
          estimatedHours: 3.0,
          actualHours: 3.0,
          revisionCount: 2,
          lastRevised: "2026-09-09"
        },
        {
          id: "top-6-3",
          name: "Greedy Strategy (Huffman, Fractional Knapsack)",
          status: "Completed",
          difficulty: "Medium",
          estimatedHours: 3.0,
          actualHours: 3.0,
          revisionCount: 2,
          lastRevised: "2026-09-12"
        },
        {
          id: "top-6-4",
          name: "Dynamic Programming (0/1 Knapsack, LCS, Matrix Chain)",
          status: "In Progress",
          difficulty: "Hard",
          estimatedHours: 5.0,
          actualHours: 2.0,
          revisionCount: 1,
          lastRevised: "2026-09-14"
        },
        {
          id: "top-6-5",
          name: "Backtracking (N-Queens, Graph Coloring)",
          status: "Not Started",
          difficulty: "Medium",
          estimatedHours: 3.0,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        },
        {
          id: "top-6-6",
          name: "NP-Completeness & Approximation Algorithms",
          status: "Not Started",
          difficulty: "Hard",
          estimatedHours: 4.0,
          actualHours: 0.0,
          revisionCount: 0,
          lastRevised: null
        }
      ]
    }
  ],

  tasks: [
    {
      id: "task-1",
      subjectId: "sub-1",
      subjectName: "DBMS",
      topic: "Normalization",
      estimatedMinutes: 60,
      estimatedTimeText: "1 hour",
      priority: "High",
      completed: false,
      dueDate: "2026-09-14",
      notes: "Focus on 1NF, 2NF, 3NF, and BCNF definitions and decomposition examples"
    },
    {
      id: "task-2",
      subjectId: "sub-2",
      subjectName: "Java",
      topic: "Exception Handling",
      estimatedMinutes: 45,
      estimatedTimeText: "45 min",
      priority: "Medium",
      completed: false,
      dueDate: "2026-09-14",
      notes: "Try-catch-finally, custom exceptions, and try-with-resources"
    },
    {
      id: "task-3",
      subjectId: "sub-3",
      subjectName: "Computer Networks",
      topic: "OSI Model",
      estimatedMinutes: 30,
      estimatedTimeText: "30 min",
      priority: "High",
      completed: false,
      dueDate: "2026-09-14",
      notes: "Functions of each layer and PDU encodings"
    },
    {
      id: "task-4",
      subjectId: "sub-5",
      subjectName: "Data Structures",
      topic: "AVL Trees Balancing",
      estimatedMinutes: 45,
      estimatedTimeText: "45 min",
      priority: "Medium",
      completed: true,
      dueDate: "2026-09-14",
      notes: "Left-Left and Left-Right rotation code verification"
    },
    {
      id: "task-5",
      subjectId: "sub-6",
      subjectName: "DAA",
      topic: "0/1 Knapsack DP Table",
      estimatedMinutes: 60,
      estimatedTimeText: "1 hour",
      priority: "High",
      completed: true,
      dueDate: "2026-09-14",
      notes: "Write bottom-up DP table algorithm and solve question paper problem"
    }
  ],

  // Study planner schedule
  plannerEvents: [
    {
      id: "plan-1",
      dayOfWeek: 1, // 0 = Sun, 1 = Mon ...
      date: "2026-09-14",
      startTime: "09:00",
      endTime: "10:30",
      subjectId: "sub-1",
      subjectName: "DBMS",
      topicName: "Normalization (1NF, 2NF, 3NF)",
      durationMinutes: 90,
      status: "pending" // "completed" | "pending"
    },
    {
      id: "plan-2",
      dayOfWeek: 1,
      date: "2026-09-14",
      startTime: "11:00",
      endTime: "12:00",
      subjectId: "sub-2",
      subjectName: "Java Programming",
      topicName: "Exception Handling Mechanisms",
      durationMinutes: 60,
      status: "completed"
    },
    {
      id: "plan-3",
      dayOfWeek: 1,
      date: "2026-09-14",
      startTime: "16:00",
      endTime: "17:00",
      subjectId: "sub-3",
      subjectName: "Computer Networks",
      topicName: "OSI vs TCP/IP Architecture",
      durationMinutes: 60,
      status: "pending"
    },
    {
      id: "plan-4",
      dayOfWeek: 2,
      date: "2026-09-15",
      startTime: "09:30",
      endTime: "11:00",
      subjectId: "sub-1",
      subjectName: "DBMS",
      topicName: "BCNF Decomposition & Dependency Preservation",
      durationMinutes: 90,
      status: "pending"
    },
    {
      id: "plan-5",
      dayOfWeek: 2,
      date: "2026-09-15",
      startTime: "14:00",
      endTime: "16:00",
      subjectId: "sub-5",
      subjectName: "Data Structures",
      topicName: "Heap Sort & Priority Queues",
      durationMinutes: 120,
      status: "pending"
    },
    {
      id: "plan-6",
      dayOfWeek: 3,
      date: "2026-09-16",
      startTime: "10:00",
      endTime: "11:30",
      subjectId: "sub-6",
      subjectName: "DAA",
      topicName: "Matrix Chain Multiplication DP",
      durationMinutes: 90,
      status: "pending"
    },
    {
      id: "plan-7",
      dayOfWeek: 4,
      date: "2026-09-17",
      startTime: "15:00",
      endTime: "16:30",
      subjectId: "sub-4",
      subjectName: "Linux & Shell",
      topicName: "Bash Scripting & Piping",
      durationMinutes: 90,
      status: "pending"
    }
  ],

  // Recent study logs for weekly chart
  weeklyStudyLogs: [
    { day: "Tue (Sep 8)", hours: 3.5 },
    { day: "Wed (Sep 9)", hours: 4.2 },
    { day: "Thu (Sep 10)", hours: 5.0 },
    { day: "Fri (Sep 11)", hours: 3.8 },
    { day: "Sat (Sep 12)", hours: 6.2 },
    { day: "Sun (Sep 13)", hours: 4.5 },
    { day: "Today (Sep 14)", hours: 3.2 }
  ]
};
