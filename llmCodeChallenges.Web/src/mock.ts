export interface Problem {
    id: number;
    title: string;
    description: string;
    tags: string[];
    language: string;
    markdownContent: string;
}

export const mockProblems: Problem[] = [
    {
        id: 1,
        title: "Calculate the Fibonacci Sequence",
        description: "Write a function to calculate the nth Fibonacci number.",
        tags: ["recursion", "dynamic programming", "math"],
        language: "Python",
        markdownContent: `# Fibonacci Sequence Challenge

## Problem Description

The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1.

## Task

Write a function that takes a number \`n\` as input and returns the nth Fibonacci number.

### Example

\`\`\`
fibonacci(0) = 0
fibonacci(1) = 1
fibonacci(5) = 5
fibonacci(10) = 55
\`\`\`

## Constraints

- 0 ≤ n ≤ 50
- Optimize your solution for better time complexity

## Hints

1. Consider using dynamic programming
2. Think about memoization
3. Can you solve it iteratively?`,
    },
    {
        id: 2,
        title: "Implement a Binary Search Algorithm",
        description: "Create a function that performs a binary search on a sorted array.",
        tags: ["algorithms", "search", "arrays"],
        language: "JavaScript",
        markdownContent: `# Binary Search Algorithm

## Problem Description

Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.

## Task

Implement a function that performs binary search on a sorted array.

### Function Signature

\`\`\`javascript
function binarySearch(arr, target)
\`\`\`

### Example

\`\`\`javascript
binarySearch([1, 2, 3, 4, 5, 6, 7], 4) // returns 3 (index)
binarySearch([1, 2, 3, 4, 5], 6) // returns -1 (not found)
\`\`\`

## Constraints

- Array is sorted in ascending order
- Array length: 1 ≤ n ≤ 10^6
- Return the index if found, -1 otherwise

## Time Complexity

Your solution should achieve **O(log n)** time complexity.`,
    },
    {
        id: 3,
        title: "Reverse a String",
        description: "Write a function to reverse a given string.",
        tags: ["strings", "basic", "manipulation"],
        language: "Java",
        markdownContent: `# Reverse a String

## Problem Description

Given a string, return a new string with the characters in reverse order.

## Task

Write a function that takes a string as input and returns the reversed string.

### Method Signature

\`\`\`java
public static String reverseString(String str)
\`\`\`

### Example

\`\`\`java
reverseString("hello") // returns "olleh"
reverseString("world") // returns "dlrow"
reverseString("") // returns ""
\`\`\`

## Constraints

- 0 ≤ string length ≤ 10^4
- String may contain any ASCII characters

## Requirements

1. Do not modify the original string
2. Handle empty strings
3. Consider Unicode characters`,
    },
    {
        id: 4,
        title: "Two Sum",
        description: "Find two numbers in an array that add up to a target value.",
        tags: ["arrays", "hash map", "easy"],
        language: "JavaScript",
        markdownContent: `# Two Sum

## Problem Description

Given an array of integers and a target value, return the indices of the two numbers that add up to the target.

## Task

Implement a function to find the pair of indices.

### Function Signature

\`\`\`javascript
function twoSum(nums, target)
\`\`\`

### Example

\`\`\`javascript
twoSum([2, 7, 11, 15], 9) // returns [0, 1]
twoSum([3, 2, 4], 6) // returns [1, 2]
\`\`\`

## Constraints

- 2 ≤ nums.length ≤ 10^4
- Each input has exactly one solution
- Use O(n) time if possible`,
    },
    {
        id: 5,
        title: "LRU Cache",
        description: "Design and implement an LRU (Least Recently Used) cache.",
        tags: ["design", "linked list", "hash map"],
        language: "TypeScript",
        markdownContent: `# LRU Cache

## Problem Description

Create a data structure that supports getting and setting key-value pairs with LRU eviction.

## Task

Support two operations: \`get(key)\` and \`put(key, value)\`.

### Example

\`\`\`typescript
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1); // returns 1
cache.put(3, 3); // evicts key 2
cache.get(2); // returns -1
\`\`\`

## Constraints

- Capacity is positive
- \`get\` and \`put\` should run in O(1) average time`,
    },
    {
        id: 6,
        title: "Merge K Sorted Lists",
        description: "Merge k sorted linked lists into one sorted list.",
        tags: ["linked list", "heap", "divide and conquer"],
        language: "Python",
        markdownContent: `# Merge K Sorted Lists

## Problem Description

You are given an array of k linked lists, each sorted in ascending order.

## Task

Merge all lists into one sorted linked list and return it.

### Example

\`\`\`python
lists = [[1,4,5],[1,3,4],[2,6]]
mergeKLists(lists) # returns [1,1,2,3,4,4,5,6]
\`\`\`

## Constraints

- 0 ≤ k ≤ 10^4
- Total nodes ≤ 10^5
- Use a min-heap or divide-and-conquer approach`,
    },
    {
        id: 7,
        title: "Valid Parentheses",
        description: "Check if a string containing brackets is valid.",
        tags: ["stack", "strings", "validation"],
        language: "C++",
        markdownContent: `# Valid Parentheses

## Problem Description

Given a string containing characters '(', ')', '{', '}', '[' and ']', determine if it is valid.

## Task

Return true if the string is valid, false otherwise.

### Example

\`\`\`cpp
isValid("()[]{}") // true
isValid("(]") // false
isValid("([)]") // false
\`\`\`

## Constraints

- 1 ≤ s.length ≤ 10^4
- Use a stack to track openings`,
    },
    {
        id: 8,
        title: "Queue Using Stacks",
        description: "Implement a queue using two stacks.",
        tags: ["stack", "queue", "design"],
        language: "Go",
        markdownContent: `# Implement Queue Using Stacks

## Problem Description

Design a queue that supports enqueue and dequeue operations using only stacks.

## Task

Support \`push(x)\`, \`pop()\`, \`peek()\`, and \`empty()\`.

### Example

\`\`\`go
q := Constructor()
q.Push(1)
q.Push(2)
q.Peek() // returns 1
q.Pop()  // returns 1
q.Empty() // false
\`\`\`

## Constraints

- Use two stacks
- Amortized O(1) per operation`,
    },
    {
        id: 9,
        title: "Missing Number",
        description: "Find the missing number in a sequence from 0 to n.",
        tags: ["math", "bitwise", "array"],
        language: "Rust",
        markdownContent: `# Missing Number

## Problem Description

Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the missing one.

## Task

Return the missing number.

### Example

\`\`\`rust
missing_number(vec![3,0,1]) // returns 2
missing_number(vec![0,1]) // returns 2
\`\`\`

## Constraints

- 1 ≤ n ≤ 10^5
- O(n) time and O(1) extra space preferred`,
    },
    {
        id: 10,
        title: "Palindrome Linked List",
        description: "Determine if a singly linked list is a palindrome.",
        tags: ["linked list", "two pointers", "medium"],
        language: "C#",
        markdownContent: `# Palindrome Linked List

## Problem Description

Check whether the values in a singly linked list read the same forward and backward.

## Task

Return true if the list is a palindrome.

### Example

\`\`\`csharp
[1,2,2,1] => true
[1,2] => false
\`\`\`

## Constraints

- 1 ≤ length ≤ 10^5
- Aim for O(1) extra space using reverse-half technique`,
    },
    {
        id: 11,
        title: "Top K Frequent Words",
        description: "Return the k most frequent words in descending order of frequency.",
        tags: ["heap", "hash map", "sorting"],
        language: "Python",
        markdownContent: `# Top K Frequent Words

## Problem Description

Given an array of strings words and an integer k, return the k most frequent strings.

## Task

Order by frequency descending; tie-break lexicographically.

### Example

\`\`\`python
topKFrequent(["i","love","leetcode","i","love","coding"], 2) # ["i","love"]
\`\`\`

## Constraints

- 1 ≤ words.length ≤ 10^5
- Use a heap or bucket sort`,
    },
    {
        id: 12,
        title: "Dijkstra Shortest Path",
        description: "Compute the shortest path in a weighted graph using Dijkstra's algorithm.",
        tags: ["graphs", "dijkstra", "priority queue"],
        language: "Java",
        markdownContent: `# Dijkstra Shortest Path

## Problem Description

Given a weighted directed graph and a source node, find the shortest distances to all nodes.

## Task

Return an array of shortest path distances; use infinity for unreachable nodes.

### Example

\`\`\`java
// Graph as adjacency list: node -> [(neighbor, weight)]
int[] dist = dijkstra(graph, 0);
// dist[i] holds min distance from 0 to i
\`\`\`

## Constraints

- Non-negative edge weights
- Use a priority queue for O((V+E) log V) time`,
    },
];
