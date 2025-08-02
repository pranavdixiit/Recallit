const defaultDecks = [
  {
    deck: "Sorting",
    cards: [
      {
        question: "What is the time complexity of Merge Sort?",
        answer: "O(n log n)",
        topic: "Sorting",
        code: `void merge(vector<int> &arr, int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) arr[k++] = L[i++];
      else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(vector<int> &arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Which sorting algorithm is stable and in-place?",
        answer: "Insertion Sort (stable), QuickSort (not stable, but in-place)",
        topic: "Sorting",
        code: `void insertionSort(vector<int> &arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How does Heap Sort work?",
        answer: "Heapify the array and repeatedly extract the top element.",
        topic: "Sorting",
        code: `void heapify(vector<int> &arr, int n, int i) {
    int largest = i, left = 2*i + 1, right = 2*i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int> &arr) {
    int n = arr.size();
    for (int i = n/2 -1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n -1; i >= 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
        codeLanguage: "cpp"
      },
      {
        question: "When is Counting Sort useful?",
        answer: "When input is integers within a bounded range.",
        topic: "Sorting",
        code: `void countingSort(vector<int> &arr) {
    int maxVal = *max_element(arr.begin(), arr.end());
    vector<int> count(maxVal + 1, 0);
    for (int num : arr) count[num]++;
    int index = 0;
    for (int i = 0; i <= maxVal; i++) {
        while (count[i]--) arr[index++] = i;
    }
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Best sorting algorithm for nearly sorted arrays?",
        answer: "Insertion Sort or TimSort.",
        topic: "Sorting",
        code: `// Insertion sort shown above applies well for nearly sorted arrays`,
        codeLanguage: "cpp"
      },
      {
        question: "Give examples of stable sorting algorithms.",
        answer: "Merge Sort, Bubble Sort, Insertion Sort.",
        topic: "Sorting",
        code: `void bubbleSort(vector<int> &arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++)
        for (int j=0; j < n - i -1; j++)
            if (arr[j] > arr[j+1]) swap(arr[j], arr[j+1]);
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Why isn't QuickSort stable?",
        answer: "Swaps can rearrange equal elements.",
        topic: "Sorting"
        // No code snippet needed here
      },
      {
        question: "Time complexity of Bubble Sort in best case?",
        answer: "O(n) when the array is already sorted.",
        topic: "Sorting"
        // No code snippet needed here
      },
      {
        question: "What determines whether to choose HeapSort or MergeSort?",
        answer: "HeapSort is in-place, MergeSort is stable.",
        topic: "Sorting"
        // No code snippet
      },
      {
        question: "What is Radix Sort and when do you use it?",
        answer: "Non-comparative sort for numbers/strings with digit positions.",
        topic: "Sorting",
        code: `void countSort(vector<int>& arr, int exp) {
    int n = arr.size();
    vector<int> output(n);
    int count[10] = {0};
    for (int i = 0; i < n; i++)
        count[(arr[i]/exp)%10]++;
    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i]/exp)%10] - 1] = arr[i];
        count[(arr[i]/exp)%10]--;
    }
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(vector<int>& arr) {
    int m = *max_element(arr.begin(), arr.end());
    for (int exp = 1; m/exp > 0; exp *= 10)
        countSort(arr, exp);
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Explain the difference between stable and unstable sorting algorithms.",
        answer: "Stable sorting maintains relative order of equal elements; unstable may not.",
        topic: "Sorting"
      },
      {
        question: "What are the space complexities of QuickSort and MergeSort?",
        answer: "QuickSort uses O(log n) average auxiliary space due to recursion; MergeSort uses O(n) auxiliary space.",
        topic: "Sorting"
      },
      {
        question: "Describe the worst-case input for QuickSort.",
        answer: "Already sorted or reverse sorted arrays can cause O(n²) worst-case.",
        topic: "Sorting",
        code: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i+1], arr[high]);
    return i+1;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is the concept of external sorting?",
        answer: "Sorting data too large to fit in memory by working with chunks on disk.",
        topic: "Sorting"
      },
      {
        question: "Explain Bucket Sort and when it is useful.",
        answer: "Distributes elements into buckets, sorts individual buckets; efficient for uniformly distributed data.",
        topic: "Sorting",
        code: `void bucketSort(vector<float> &arr) {
    int n = arr.size();
    vector<vector<float>> buckets(n);
    for (float num : arr) {
        int idx = n * num;
        buckets[idx].push_back(num);
    }
    for (auto &bucket : buckets)
        sort(bucket.begin(), bucket.end());
    int index = 0;
    for (auto &bucket : buckets)
        for (float num : bucket)
            arr[index++] = num;
}`,
        codeLanguage: "cpp"
      }
    ],
  },
  {
    deck: "Searching",
    cards: [
      {
        question: "What is Binary Search?",
        answer: "Divide sorted array into halves to find target.",
        topic: "Searching",
        code: `int binarySearch(vector<int>& arr, int target) {
    int l = 0, r = arr.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How do you search in a rotated sorted array?",
        answer: "Modified binary search checking mid, low, and high index values.",
        topic: "Searching",
        code: `int searchRotatedArray(vector<int>& arr, int target) {
    int l = 0, r = arr.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == target) return mid;
        if (arr[l] <= arr[mid]) {
            if (arr[l] <= target && target < arr[mid])
                r = mid -1;
            else l = mid + 1;
        } else {
            if (arr[mid] < target && target <= arr[r])
                l = mid + 1;
            else r = mid -1;
        }
    }
    return -1;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Explain linear search and its time complexity.",
        answer: "O(n) comparison until match is found or end is reached.",
        topic: "Searching",
        code: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++)
        if (arr[i] == target) return i;
    return -1;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is ternary search?",
        answer: "Binary search variant splitting into 3 sections.",
        topic: "Searching",
        code: `int ternarySearch(int l, int r, int key, vector<int>& arr) {
    while (r >= l) {
        int mid1 = l + (r - l) / 3;
        int mid2 = r - (r - l) / 3;
        if (arr[mid1] == key) return mid1;
        if (arr[mid2] == key) return mid2;
        if (key < arr[mid1]) r = mid1 - 1;
        else if (key > arr[mid2]) l = mid2 + 1;
        else {
            l = mid1 + 1;
            r = mid2 - 1;
        }
    }
    return -1;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How do you search in a 2D matrix?",
        answer: "Binary search from top-right or row/column-wise search.",
        topic: "Searching",
        code: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int rows = matrix.size(), cols = matrix[0].size();
    int r = 0, c = cols - 1;
    while (r < rows && c >= 0) {
        if (matrix[r][c] == target) return true;
        else if (matrix[r][c] > target) c--;
        else r++;
    }
    return false;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "When is jump search better than linear?",
        answer: "On sorted data with low memory access cost.",
        topic: "Searching",
        code: `int jumpSearch(vector<int>& arr, int target) {
    int n = arr.size();
    int step = sqrt(n);
    int prev = 0;
    while (arr[min(step, n) - 1] < target) {
        prev = step;
        step += sqrt(n);
        if (prev >= n) return -1;
    }
    for (int i = prev; i < min(step, n); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How do you find peak element in an array?",
        answer: "Binary search variant comparing neighbors.",
        topic: "Searching",
        code: `int findPeakElement(vector<int>& nums) {
    int l = 0, r = nums.size() - 1;
    while(l < r) {
        int mid = l + (r - l) / 2;
        if(nums[mid] < nums[mid + 1])
            l = mid + 1;
        else r = mid;
    }
    return l;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is Interpolation Search?",
        answer: "Improves binary search by estimating position; works on uniformly distributed data.",
        topic: "Searching",
        code: `int interpolationSearch(vector<int>& arr, int x) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi && x >= arr[lo] && x <= arr[hi]) {
        int pos = lo + ((double)(hi - lo) / (arr[hi] - arr[lo])) * (x - arr[lo]);
        if (arr[pos] == x) return pos;
        if (arr[pos] < x) lo = pos + 1;
        else hi = pos - 1;
    }
    return -1;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "When should you use BFS?",
        answer: "To find the shortest path in an unweighted graph.",
        topic: "Searching",
        code: `void BFS(int start, vector<vector<int>> &adj) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        // process node
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`,
        codeLanguage: "cpp"
      },
      {
        question: "When should you use DFS?",
        answer: "To explore all paths/depths, especially on recursion or backtracking problems.",
        topic: "Searching",
        code: `void DFS(int node, vector<vector<int>> &adj, vector<bool> &visited) {
    visited[node] = true;
    // process node
    for (int neighbor : adj[node]) {
        if (!visited[neighbor])
            DFS(neighbor, adj, visited);
    }
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Explain exponential search and its use-case.",
        answer: "Searches in a sorted array by finding a range exponentially then binary searching.",
        topic: "Searching",
        code: `int binarySearch(vector<int>& arr, int l, int r, int x) {
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == x) return mid;
        else if (arr[mid] < x) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}

int exponentialSearch(vector<int>& arr, int x) {
    if (arr[0] == x) return 0;
    int i = 1;
    while(i < arr.size() && arr[i] <= x) i *= 2;
    return binarySearch(arr, i/2, min(i, (int)arr.size()-1), x);
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is the difference between BFS and DFS in graph search?",
        answer: "BFS uses queue for level-order; DFS uses stack/recursion for depth-first exploration.",
        topic: "Searching"
      },
      {
        question: "How to find an element in an infinite sorted array?",
        answer: "Use exponential search to find the range, then binary search.",
        topic: "Searching"
      },
      {
        question: "What is jump search’s time complexity?",
        answer: "O(√n) for sorted arrays.",
        topic: "Searching"
      },
      {
        question: "Explain linear probing in hashing.",
        answer: "Collision resolution technique that searches next slots linearly.",
        topic: "Searching",
        code: `int linearProbing(vector<int> &hashTable, int key, int size) {
    int hashVal = key % size;
    int i = 0;
    while (hashTable[(hashVal + i) % size] != -1) {
        i++;
        if (i == size) return -1; // Table full
    }
    return (hashVal + i) % size;
}`,
        codeLanguage: "cpp"
      }
    ],
  },
  {
    deck: "Dynamic Programming",
    cards: [
      {
        question: "What is Dynamic Programming?",
        answer: "A method to solve problems by breaking into overlapping subproblems.",
        topic: "DP",
        code: `// Example: Fibonacci with DP
int fib(int n, vector<int>& dp) {
    if (n <= 1) return n;
    if (dp[n] != -1) return dp[n];
    return dp[n] = fib(n-1, dp) + fib(n-2, dp);
}`
        ,
        codeLanguage: "cpp"
      },
      {
        question: "Tabulation vs Memoization?",
        answer: "Tabulation: bottom-up. Memoization: top-down recursion with cache.",
        topic: "DP"
      },
      {
        question: "What is the Knapsack problem?",
        answer: "0/1 selection of items to maximize value without exceeding capacity.",
        topic: "DP",
        code: `int knapsack(int W, vector<int> &wt, vector<int> &val, int n) {
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (wt[i-1] <= w)
                dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w]);
            else dp[i][w] = dp[i-1][w];
        }
    }
    return dp[n][W];
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How is the Fibonacci sequence solved using DP?",
        answer: "Store previous results and avoid redundant calls.",
        topic: "DP",
        code: `int fib(int n) {
    vector<int> dp(n+1);
    dp[0] = 0; dp[1] = 1;
    for(int i=2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Define Overlapping Subproblems.",
        answer: "Problem contains subproblems that repeat.",
        topic: "DP"
      },
      {
        question: "What is Optimal Substructure?",
        answer: "Optimal solution can be composed from optimal subproblems.",
        topic: "DP"
      },
      {
        question: "Explain Longest Increasing Subsequence problem.",
        answer: "Find longest strictly increasing subsequence using DP.",
        topic: "DP",
        code: `int LIS(vector<int> &arr) {
    int n = arr.size();
    vector<int> dp(n, 1);
    int maxLen = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[i] > arr[j] && dp[i] < dp[j] + 1)
                dp[i] = dp[j]+1;
        }
        maxLen = max(maxLen, dp[i]);
    }
    return maxLen;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is Edit Distance and how is it solved?",
        answer: "Min operations to convert one string to another; solved using 2D DP.",
        topic: "DP",
        code: `int editDistance(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1));
    for (int i=0; i <= m; i++) dp[i][0] = i;
    for (int j=0; j <= n; j++) dp[0][j] = j;
    for (int i=1; i <= m; i++) {
        for (int j=1; j <= n; j++) {
            if (s1[i-1] == s2[j-1]) dp[i][j] = dp[i-1][j-1];
            else dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
        }
    }
    return dp[m][n];
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is the Coin Change problem?",
        answer: "Find min coins to make amount, or number of combinations.",
        topic: "DP",
        code: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount+1, amount+1);
    dp[0] = 0;
    for (int i=1; i <= amount; i++) {
        for (int c : coins) {
            if (c <= i)
                dp[i] = min(dp[i], dp[i-c] +1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How to avoid recomputation in recursion?",
        answer: "Use memoization to store intermediate results.",
        topic: "DP"
      },
      {
        question: "What is the difference between bottom-up and top-down DP?",
        answer: "Bottom-up solves smallest subproblems first; top-down uses recursion with memoization.",
        topic: "DP"
      },
      {
        question: "What is the subset sum problem?",
        answer: "Determine if a subset of given numbers sums to a target.",
        topic: "DP",
        code: `bool subsetSum(vector<int> &nums, int sum) {
    int n = nums.size();
    vector<vector<bool>> dp(n+1, vector<bool>(sum+1, false));
    for (int i = 0; i <= n; i++) dp[i][0] = true;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= sum; j++) {
            dp[i][j] = dp[i-1][j];
            if (nums[i-1] <= j)
                dp[i][j] = dp[i][j] || dp[i-1][j - nums[i-1]];
        }
    }
    return dp[n][sum];
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What are state and transition in DP?",
        answer: "State represents subproblem parameters; transition defines recursive relation between states.",
        topic: "DP"
      },
      {
        question: "Explain why DP is applicable to the Matrix Chain Multiplication problem.",
        answer: "It has optimal substructure and overlapping subproblems.",
        topic: "DP"
      },
      {
        question: "What data structures are often used to implement DP?",
        answer: "Arrays, hashmaps, 2D matrices for tabulation or memoization.",
        topic: "DP"
      }
    ]
  },
  {
    deck: "Recursion",
    cards: [
      {
        question: "What is recursion?",
        answer: "A function that solves a problem by calling itself.",
        topic: "Recursion",
        code: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is a base case in recursion?",
        answer: "Condition where recursion ends.",
        topic: "Recursion"
      },
      {
        question: "Why can recursion cause a stack overflow?",
        answer: "Too many function calls without hitting base case.",
        topic: "Recursion"
      },
      {
        question: "What is tail recursion?",
        answer: "Last operation is the recursive call, enabling optimizations.",
        topic: "Recursion",
        code: `int tailFactorial(int n, int acc = 1) {
    if (n <= 1) return acc;
    return tailFactorial(n - 1, n * acc);
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How to reverse a linked list recursively?",
        answer: "Reverse rest and attach current to end recursively.",
        topic: "Recursion",
        code: `struct Node {
    int data; Node* next;
};

Node* reverseList(Node* head) {
    if (!head || !head->next) return head;
    Node* newHead = reverseList(head->next);
    head->next->next = head;
    head->next = nullptr;
    return newHead;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Print numbers 1 to N using recursion?",
        answer: "Base: if n==0 return; recursive call: print(n-1) then print(n).",
        topic: "Recursion",
        code: `void printNumbers(int n) {
    if (n == 0) return;
    printNumbers(n - 1);
    cout << n << " ";
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is the recursive approach to binary search?",
        answer: "Check mid, call left or right recursively based on target.",
        topic: "Recursion",
        code: `int recursiveBinarySearch(vector<int>& arr, int l, int r, int x) {
    if (r < l) return -1;
    int mid = l + (r - l) / 2;
    if (arr[mid] == x) return mid;
    else if (arr[mid] > x) return recursiveBinarySearch(arr, l, mid - 1, x);
    else return recursiveBinarySearch(arr, mid + 1, r, x);
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Convert recursion to iteration?",
        answer: "Use explicit stack to simulate recursive calls.",
        topic: "Recursion"
      },
      {
        question: "Recursively generate all subsets of a set?",
        answer: "Backtracking with inclusion/exclusion at each index.",
        topic: "Recursion",
        code: `void generateSubsets(vector<int>& arr, int index, vector<int>& curr, vector<vector<int>>& result) {
    if (index == arr.size()) {
        result.push_back(curr);
        return;
    }
    // include arr[index]
    curr.push_back(arr[index]);
    generateSubsets(arr, index + 1, curr, result);
    // exclude arr[index]
    curr.pop_back();
    generateSubsets(arr, index + 1, curr, result);
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is backtracking and how is it related to recursion?",
        answer: "Recursive trial-and-error with undoing previous steps.",
        topic: "Recursion"
      },
      {
        question: "What are the advantages of recursion?",
        answer: "Simplicity and cleaner code for complex problems like trees.",
        topic: "Recursion"
      },
      {
        question: "What is the difference between direct and indirect recursion?",
        answer: "Direct calls itself; indirect calls another function that eventually calls the first.",
        topic: "Recursion"
      },
      {
        question: "Explain recursion tree method for analyzing complexity.",
        answer: "Visualizes function calls as tree to calculate time complexity.",
        topic: "Recursion"
      },
      {
        question: "How to detect infinite recursion?",
        answer: "Missing or incorrect base case causes infinite calls.",
        topic: "Recursion"
      },
      {
        question: "Explain how recursion works with stack frames.",
        answer: "Each call adds a frame to the call stack until base case.",
        topic: "Recursion"
      }
    ]
  },
  {
    deck: "Graphs",
    cards: [
      {
        question: "What is Breadth-First Search?",
        answer: "Level-order traversal using a queue.",
        topic: "Graphs",
        code: `void BFS(int start, vector<vector<int>> &adj) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        // process node
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is Depth-First Search?",
        answer: "Explores as deep as possible using stack/recursion.",
        topic: "Graphs",
        code: `void DFS(int node, vector<vector<int>> &adj, vector<bool> &visited) {
    visited[node] = true;
    // process node
    for (int neighbor : adj[node]) {
        if (!visited[neighbor])
            DFS(neighbor, adj, visited);
    }
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How to detect a cycle in a graph?",
        answer: "Use DFS with visited + recursion stack (directed), or union-find (undirected).",
        topic: "Graphs",
        code: `// Example for directed graph cycle detection using DFS
bool dfsCycle(int node, vector<vector<int>> &adj, vector<bool> &visited, vector<bool> &recStack) {
    visited[node] = true;
    recStack[node] = true;
    for (auto neighbor : adj[node]) {
        if (!visited[neighbor] && dfsCycle(neighbor, adj, visited, recStack)) return true;
        else if (recStack[neighbor]) return true;
    }
    recStack[node] = false;
    return false;
}

bool hasCycle(vector<vector<int>> &adj) {
    int n = adj.size();
    vector<bool> visited(n, false), recStack(n, false);
    for (int i = 0; i < n; i++) {
        if (!visited[i] && dfsCycle(i, adj, visited, recStack))
            return true;
    }
    return false;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is topological sort?",
        answer: "Ordering of DAG nodes where u→v means u before v.",
        topic: "Graphs",
        code: `void topoSortUtil(int v, vector<vector<int>>& adj, vector<bool>& visited, stack<int>& Stack) {
    visited[v] = true;
    for (auto i : adj[v])
        if (!visited[i])
            topoSortUtil(i, adj, visited, Stack);
    Stack.push(v);
}

vector<int> topoSort(vector<vector<int>>& adj) {
    int V = adj.size();
    vector<bool> visited(V, false);
    stack<int> Stack;
    for (int i = 0; i < V; i++)
        if (!visited[i]) topoSortUtil(i, adj, visited, Stack);
    vector<int> result;
    while (!Stack.empty()) {
        result.push_back(Stack.top());
        Stack.pop();
    }
    return result;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Difference between adjacency list and matrix?",
        answer: "List: efficient for sparse; Matrix: fast edge lookups.",
        topic: "Graphs"
      },
      {
        question: "When to use Dijkstra's algorithm?",
        answer: "Find shortest path in graph with non-negative edges.",
        topic: "Graphs",
        code: `void dijkstra(int src, vector<vector<pair<int,int>>> &adj, vector<int> &dist) {
    dist.assign(adj.size(), INT_MAX);
    dist[src] = 0;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    pq.push({0, src});
    while(!pq.empty()) {
        int u = pq.top().second; pq.pop();
        for (auto &edge : adj[u]) {
            int v = edge.first, w = edge.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How does Bellman-Ford differ from Dijkstra?",
        answer: "Handles negative edges; slower.",
        topic: "Graphs",
        code: `bool bellmanFord(int V, int E, vector<tuple<int,int,int>> &edges, int src, vector<int> &dist) {
    dist.assign(V, INT_MAX);
    dist[src] = 0;
    for (int i = 1; i < V; i++) {
        for (auto [u, v, w] : edges) {
            if (dist[u] != INT_MAX && dist[u] + w < dist[v])
                dist[v] = dist[u] + w;
        }
    }
    // Check for negative weight cycle
    for (auto [u, v, w] : edges) {
        if (dist[u] != INT_MAX && dist[u] + w < dist[v])
            return false; // Negative cycle detected
    }
    return true;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is a bipartite graph?",
        answer: "Vertices can be split into 2 sets; checked with BFS coloring.",
        topic: "Graphs",
        code: `bool isBipartite(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> color(n, -1);
    for (int i = 0; i< n; ++i) {
        if(color[i] == -1) {
            queue<int> q;
            q.push(i);
            color[i] = 0;
            while(!q.empty()) {
                int u = q.front(); q.pop();
                for(int v : graph[u]) {
                    if(color[v] == -1) {
                        color[v] = 1 - color[u];
                        q.push(v);
                    } else if(color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is a strongly connected component?",
        answer: "Subgraph where every node is reachable from every other.",
        topic: "Graphs",
        code: `// Tarjan's Algorithm outline (code is complex; example snippet shown)
int time = 0;
vector<int> low, disc, stackMember;
stack<int> stk;

void SCCUtil(int u, vector<vector<int>>& adj) {
    disc[u] = low[u] = ++time;
    stk.push(u);
    stackMember[u] = true;

    for (int v : adj[u]) {
        if (disc[v] == -1) {
            SCCUtil(v, adj);
            low[u] = min(low[u], low[v]);
        } else if (stackMember[v]) {
            low[u] = min(low[u], disc[v]);
        }
    }
    if(low[u] == disc[u]) {
        while(stk.top() != u) {
            int w = stk.top(); stk.pop();
            stackMember[w] = false;
            // w is part of current SCC
        }
        stk.pop();
        stackMember[u] = false;
    }
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How do you count the number of islands in grid?",
        answer: "DFS or BFS for each unvisited land cell.",
        topic: "Graphs",
        code: `int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    int m = grid.size(), n = grid[0].size();
    vector<vector<bool>> visited(m, vector<bool>(n,false));
    auto dfs = [&](auto self, int r, int c) -> void {
        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] == '0' || visited[r][c])
            return;
        visited[r][c] = true;
        self(self, r+1, c); self(self, r-1, c);
        self(self, r, c+1); self(self, r, c-1);
    };

    for (int i=0; i<m; i++) {
        for (int j=0; j<n; j++) {
            if(grid[i][j] == '1' && !visited[i][j]) {
                count++;
                dfs(dfs, i, j);
            }
        }
    }
    return count;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is Prim’s algorithm?",
        answer: "Finds minimum spanning tree using greedy approach.",
        topic: "Graphs",
        code: `void primMST(int V, vector<vector<pair<int,int>>> &adj) {
    vector<int> key(V, INT_MAX);
    vector<bool> inMST(V, false);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;

    key[0] = 0;
    pq.push({0,0});
    while(!pq.empty()) {
        int u = pq.top().second; pq.pop();
        inMST[u] = true;
        for(auto &[v,w] : adj[u]) {
            if(!inMST[v] && w < key[v]) {
                key[v] = w;
                pq.push({key[v], v});
            }
        }
    }
    // key array now has MST weights
}`,
        codeLanguage: "cpp"
      },
      {
        question: "Explain Kruskal’s algorithm.",
        answer: "Finds minimum spanning tree by sorting edges and union-find.",
        topic: "Graphs",
        code: `struct Edge {
    int u, v, w;
    bool operator<(const Edge &e) const {
        return w < e.w;
    }
};

int find(int x, vector<int>& parent) {
    if(parent[x] != x)
        parent[x] = find(parent[x], parent);
    return parent[x];
}

void unionSet(int a, int b, vector<int>& parent, vector<int>& rank) {
    a = find(a, parent);
    b = find(b, parent);
    if(a != b) {
        if(rank[a] < rank[b]) swap(a,b);
        parent[b] = a;
        if(rank[a] == rank[b]) rank[a]++;
    }
}

int kruskalMST(int V, vector<Edge> &edges) {
    sort(edges.begin(), edges.end());
    vector<int> parent(V), rank(V, 0);
    for(int i=0; i<V; i++) parent[i] = i;
    int sum = 0;
    for(auto &edge : edges) {
        if(find(edge.u, parent) != find(edge.v, parent)) {
            unionSet(edge.u, edge.v, parent, rank);
            sum += edge.w;
        }
    }
    return sum;
}`,
        codeLanguage: "cpp"
      },
      {
        question: "How does graph representation affect algorithm performance?",
        answer: "Adjacency list is memory efficient; adjacency matrix allows faster checks.",
        topic: "Graphs"
      },
      {
        question: "Explain Floyd-Warshall algorithm.",
        answer: "Dynamic programming to find shortest paths between all pairs.",
        topic: "Graphs",
        code: `void floydWarshall(vector<vector<int>> &dist) {
    int V = dist.size();
    for (int k = 0; k < V; k++)
        for (int i = 0; i < V; i++)
            for (int j = 0; j < V; j++)
                if(dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
}`,
        codeLanguage: "cpp"
      },
      {
        question: "What is a DAG and its applications?",
        answer: "Directed Acyclic Graph; used in dependency resolution, task scheduling.",
        topic: "Graphs"
      }
    ]
  },
// Further decks can similarly be expanded on the same pattern as above.

  {
    deck: "Arrays & Strings",
    cards: [
      { question: "What is the difference between an array and a linked list?", answer: "Arrays have contiguous memory, linked lists have pointers to next elements.", topic: "Arrays" },
      { question: "How do you reverse a string in place?", answer: "Swap characters from start and end moving towards center.", topic: "Strings" },
      { question: "Explain two-pointer technique.", answer: "Use two indices moving through data structure, useful for searching or sorting.", topic: "Arrays" },
      { question: "What is a common approach to find duplicates in an array?", answer: "Use hashsets or sorting methods.", topic: "Arrays" },
      { question: "Describe how substring search algorithms like KMP work.", answer: "Preprocess pattern to skip comparisons when mismatch occurs.", topic: "Strings" },
      { question: "How do you check if two strings are anagrams?", answer: "Sort and compare or count character frequencies.", topic: "Strings" },
      { question: "Explain sliding window technique.", answer: "Maintain a window of elements and slide over array/string for optimization.", topic: "Arrays" },
      { question: "How to find the maximum sum subarray?", answer: "Use Kadane’s algorithm in linear time.", topic: "Arrays" },
      { question: "What are common string manipulation functions in JavaScript?", answer: "substring, slice, indexOf, replace, split, etc.", topic: "Strings" },
      { question: "Explain palindrome checking logic.", answer: "Compare characters from start and end moving inward.", topic: "Strings" },
    ],
  },
  {
    deck: "Trees & Binary Trees",
    cards: [
      { question: "What is a binary tree?", answer: "A tree data structure where each node has at most two children.", topic: "Trees" },
      { question: "Explain inorder, preorder, and postorder traversals.", answer: "Different ways to traverse nodes: left-root-right, root-left-right, left-right-root.", topic: "Trees" },
      { question: "What is a binary search tree (BST)?", answer: "A binary tree with left < root < right property.", topic: "Trees" },
      { question: "How do you find the height of a binary tree?", answer: "Recursively compute max height of subtrees + 1.", topic: "Trees" },
      { question: "Explain level order traversal.", answer: "Traverse tree breadth-first using a queue.", topic: "Trees" },
      { question: "What is a balanced tree?", answer: "A tree where heights of two child subtrees differ by no more than one.", topic: "Trees" },
      { question: "Describe how to serialize and deserialize a binary tree.", answer: "Convert tree to string and back using traversal order.", topic: "Trees" },
      { question: "What is lowest common ancestor?", answer: "The deepest node that is ancestor to both given nodes.", topic: "Trees" },
    ],
  },
  {
    deck: "Hashing",
    cards: [
      { question: "What is a hash function?", answer: "Function converting input to fixed-size value or key.", topic: "Hashing" },
      { question: "What are hash collisions?", answer: "When two inputs produce the same hash value.", topic: "Hashing" },
      { question: "Explain separate chaining and open addressing.", answer: "Collision resolution techniques for hash tables.", topic: "Hashing" },
      { question: "How to implement a basic hashmap?", answer: "Use array + linked lists or open addressing for collisions.", topic: "Hashing" },
      { question: "What makes a good hash function?", answer: "Uniform distribution, fast computation, minimization of collisions.", topic: "Hashing" },
      { question: "Describe real-world examples of hashing.", answer: "Password storage, caches, databases, checksum.", topic: "Hashing" },
      { question: "Explain how to handle collisions in a hash map.", answer: "Use chaining or probing.", topic: "Hashing" },
    ],
  },
  {
    deck: "Bit Manipulation",
    cards: [
      { question: "What are bitwise operators in JavaScript?", answer: "& (AND), | (OR), ^ (XOR), ~ (NOT), <<, >>, >>> (shifts).", topic: "Bitwise" },
      { question: "Explain how to check if a number is a power of two using bits.", answer: "Check if n & (n-1) == 0 for n > 0.", topic: "Bitwise" },
      { question: "How do you count the number of set bits in an integer?", answer: "Use Kernighan’s algorithm or built-in functions.", topic: "Bitwise" },
      { question: "What is XOR used for in problems?", answer: "Find unique elements, toggle bits, swap values.", topic: "Bitwise" },
      { question: "How do you invert bits for an integer?", answer: "Use ~ operator and masking for bit length.", topic: "Bitwise" },
      { question: "Explain the difference between signed and unsigned shifts.", answer: "Signed preserves sign; unsigned shifts zero-fill.", topic: "Bitwise" },
    ],
  },
  {
    deck: "Web Development",
    cards: [
      { question: "What does HTML stand for?", answer: "HyperText Markup Language", topic: "HTML" },
      { question: "Semantic HTML example for navigation:", answer: "<nav> ... </nav>", topic: "HTML" },
      { question: "How do you center a div horizontally in CSS?", answer: "margin:0 auto; or flex/justify-content center;", topic: "CSS" },
      { question: "What does box-sizing: border-box do?", answer: "Padding/border are included in element’s width/height.", topic: "CSS" },
      { question: "Difference between == and === in JavaScript?", answer: "== compares value (coercive), === strict type/value.", topic: "JavaScript" },
      { question: "What is event bubbling?", answer: "Event propagates from child to parent elements.", topic: "JavaScript" },
      { question: "What is a closure?", answer: "A function that accesses variables outside its scope.", topic: "JavaScript" },
      { question: "Explain useState in React.", answer: "A React hook for stateful values in functional components.", topic: "React" },
      { question: "Difference between props and state?", answer: "Props are external inputs; state is internal, managed by the component.", topic: "React" },
      { question: "What status code is used for 'not found'?", answer: "404", topic: "HTTP" },
      { question: "CORS means?", answer: "Cross-Origin Resource Sharing controls browser resource access restrictions.", topic: "HTTP" },
      { question: "What is REST?", answer: "Representational State Transfer – web API style pattern.", topic: "APIs" },
      { question: "How do you install a package in Node?", answer: "npm install <package>", topic: "Node.js" },
      { question: "How do you create middleware in Express?", answer: "A function with (req, res, next) signature, used with app.use().", topic: "Express" },
      { question: "What is SSR?", answer: "Server-side rendering; rendering HTML on server for SEO/speed.", topic: "Web Performance" },
      { question: "Name 2 popular CSS-in-JS libraries for React.", answer: "styled-components, emotion", topic: "React" },
      // New questions:
      { question: "Explain the Virtual DOM in React.", answer: "An in-memory representation of the real DOM to optimize UI rendering.", topic: "React" },
      { question: "What are React hooks?", answer: "Functions to use state and lifecycle features in functional components.", topic: "React" },
      { question: "What are RESTful APIs?", answer: "APIs following REST constraints: stateless, resource-based URIs, HTTP verbs.", topic: "APIs" },
      { question: "Difference between client-side and server-side rendering?", answer: "Client-side renders DOM in browser; server-side renders HTML on server.", topic: "Web Performance" },
      { question: "What is the Event Loop in JavaScript?", answer: "Mechanism handling asynchronous callbacks in a single-threaded environment.", topic: "JavaScript" },
    ],
  },
  {
    deck: "System Design",
    cards: [
      { question: "What is load balancing?", answer: "Distributing traffic across multiple servers to increase availability and reliability.", topic: "Scaling" },
      { question: "How would you design a URL shortener?", answer: "Map unique short keys to long URLs using hash maps or DB, handle collisions, expire olds.", topic: "System" },
      { question: "Explain CAP theorem.", answer: "In distributed systems: Consistency, Availability, Partition Tolerance. You can only pick 2.", topic: "Distributed Systems" },
      { question: "Explain horizontal vs vertical scaling.", answer: "Horizontal: add more machines. Vertical: increase machine specs.", topic: "Scaling" },
      { question: "Describe eventual consistency.", answer: "Updates are eventually consistent across distributed nodes over time.", topic: "Consistency" },
      { question: "What is sharding?", answer: "Splitting data across multiple databases/servers to scale writes/reads.", topic: "Databases" },
      { question: "How do you prevent cache stampede?", answer: "Use locking, staggering expiration, or request coalescing.", topic: "Caching" },
      { question: "How would you design Twitter feed?", answer: "Fan-out on write/read, use caching, DB indexes for recent tweets per user.", topic: "System" },
      { question: "How do you handle rate limiting?", answer: "Fixed window, sliding window, token bucket or leaky bucket algorithms.", topic: "Traffic" },
      { question: "Explain CDN.", answer: "Content Delivery Network; caches assets at global edge servers for speed.", topic: "Performance" },
      // New questions:
      { question: "What is a message queue?", answer: "A system that enables asynchronous communication using messages between services.", topic: "System" },
      { question: "Explain microservices architecture.", answer: "Architectural style structuring app as loosely coupled services.", topic: "System" },
      { question: "What are eventual consistency and strong consistency?", answer: "Eventual: data updates propagate over time; strong: immediate consistency.", topic: "Consistency" },
      { question: "What is caching and cache eviction policies?", answer: "Storing frequent data in fast storage; policies decide what to remove when full.", topic: "Caching" },
      { question: "How does DNS work?", answer: "Translates domain names to IP addresses using hierarchical servers.", topic: "Networking" },
    ],
  },
  {
    deck: "Databases & SQL",
    cards: [
      { question: "What is a primary key?", answer: "Unique identifier for database records.", topic: "Databases" },
      { question: "Explain normalization and its forms.", answer: "Organizing database to reduce redundancy and dependency.", topic: "Databases" },
      { question: "What is an index?", answer: "Data structure improving data retrieval speed.", topic: "Databases" },
      { question: "Difference between INNER JOIN and LEFT JOIN?", answer: "INNER JOIN returns matched rows only; LEFT JOIN returns all from left table.", topic: "Databases" },
      { question: "What are transactions and ACID properties?", answer: "Transactions ensure consistency through Atomicity, Consistency, Isolation, Durability.", topic: "Databases" },
      { question: "What is denormalization and when is it used?", answer: "Adding redundancy to improve read performance.", topic: "Databases" },
    ],
  },
  {
    deck: "Concurrency & Multithreading",
    cards: [
      { question: "What is concurrency?", answer: "Multiple processes making progress simultaneously.", topic: "Concurrency" },
      { question: "Explain multithreading.", answer: "Multiple threads executing within a single program.", topic: "Concurrency" },
      { question: "What are race conditions?", answer: "When multiple threads access shared data causing inconsistent outcomes.", topic: "Concurrency" },
      { question: "Describe deadlocks and how to prevent them.", answer: "Issues from circular resource wait; prevent via locking order or timeout.", topic: "Concurrency" },
      { question: "What is a mutex?", answer: "Mutual exclusion object for synchronized access.", topic: "Concurrency" },
      { question: "Explain the difference between process and thread.", answer: "Processes have separate memory; threads share memory space.", topic: "Concurrency" },
    ],
  },
  {
    deck: "Behavioral",
    cards: [
      { question: "Tell me about yourself.", answer: "Share a quick summary — education, work, skills, and what excites you about coding.", topic: "HR" },
      { question: "Describe a time you solved a conflict.", answer: "Explain the situation, action you took, and the positive outcome.", topic: "HR" },
      { question: "Why do you want this job?", answer: "Tie your skills/interests to the job and the company mission.", topic: "HR" },
      { question: "What are your strengths and weaknesses?", answer: "Strengths: relevant technical skills or soft skills. Weakness: something improving; never 'I work too hard!'", topic: "HR" },
      { question: "Describe a challenging bug you fixed.", answer: "Explain the technical issue and how you found and solved it.", topic: "HR" },
      { question: "How do you handle tight deadlines?", answer: "Prioritize tasks, communicate with stakeholders, focus, adapt.", topic: "HR" },
      { question: "How do you stay updated on technology?", answer: "Mention blogs, newsletters, courses, personal projects.", topic: "HR" },
      // New questions:
      { question: "How do you handle feedback or criticism?", answer: "Listen actively and apply improvements constructively.", topic: "HR" },
      { question: "Explain a time you worked in a team.", answer: "Discuss collaboration, role, and outcome.", topic: "HR" },
      { question: "Describe a time you failed and how you dealt with it.", answer: "Share what happened, lessons learned, and changes made.", topic: "HR" },
     ],
  }
];

export default defaultDecks;