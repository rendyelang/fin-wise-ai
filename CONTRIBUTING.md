# Contributing to FinWise AI

First off, thanks for considering contributing to FinWise AI! It's people like you that make FinWise AI such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem** in as much detail as possible
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (device, OS, app version, etc)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Follow the styleguides (see below)
* Include appropriate test cases
* End all files with a newline
* Avoid platform-dependent code
* Write clear, meaningful commit messages

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Git

### Local Development

1. **Fork the repository**
   ```bash
   # Visit https://github.com/rendyelang/finwise-ai and click "Fork"
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/finwise-ai.git
   cd finwise-ai
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/rendyelang/finwise-ai.git
   git fetch upstream
   ```

4. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or for bugs:
   git checkout -b fix/bug-description
   ```

5. **Install dependencies**
   ```bash
   npm install
   ```

6. **Create `.env.local` for testing**
   ```bash
   cp .env.example .env.local
   # Configure with test Firebase project & API keys
   ```

7. **Start development server**
   ```bash
   npm start
   ```

## Git Workflow

### Branch Naming Convention

- **Feature**: `feature/short-description` (e.g., `feature/expense-tracker`)
- **Bug Fix**: `fix/bug-description` (e.g., `fix/budget-calculation`)
- **Documentation**: `docs/description` (e.g., `docs/api-guide`)
- **Refactor**: `refactor/description` (e.g., `refactor/firebase-service`)

### Commit Message Convention

We follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, dependencies, etc

**Examples:**
```
feat(expenses): add recurring transaction support

- Allow users to create recurring expenses
- Add frequency options (daily, weekly, monthly)
- Auto-generate transactions based on frequency

Closes #123
```

```
fix(budget): correct category budget calculation

The budget calculation was not accounting for transactions from previous months.

Fixes #456
```

## Styleguides

### JavaScript/TypeScript Code Style

We use ESLint and Prettier for code formatting. Before pushing:

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

**Key Guidelines:**
- Use TypeScript for type safety
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Use arrow functions for callbacks
- Avoid `var`, use `const` and `let`

**Example:**
```typescript
// Good
const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Bad
var total = 0;
for (var i = 0; i < expenses.length; i++) {
  total = total + expenses[i].amount;
}
```

### React Component Style

```typescript
// Use functional components with hooks
interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded">
      <div>
        <h3 className="font-semibold">{expense.category}</h3>
        <p className="text-gray-600">{expense.description}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold">${expense.amount}</span>
        <button onClick={() => onDelete(expense.id)}>Delete</button>
      </div>
    </div>
  );
};
```

**Component Guidelines:**
- Use functional components with hooks
- Keep components small and reusable
- Use TypeScript interfaces for props
- Add JSDoc comments for complex props
- Keep styles with Tailwind CSS

### Naming Conventions

```typescript
// Files
// Components: PascalCase
ExpenseList.tsx
BudgetForm.tsx

// Services: camelCase
firebaseService.ts
aiAssistant.ts

// Utils: camelCase
currencyFormatter.ts
dateHelper.ts

// Constants: UPPER_SNAKE_CASE
const MAX_BUDGET_ITEMS = 50;
const DEFAULT_CURRENCY = 'USD';

// Variables & Functions: camelCase
const userExpenses = [];
const calculateTotal = () => {};
```

## Testing

### Writing Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage
npm test:coverage
```

**Test Structure:**
```typescript
describe('ExpenseService', () => {
  describe('addExpense', () => {
    it('should add a new expense to the list', () => {
      // Arrange
      const expense = { id: '1', amount: 50, category: 'Food' };
      
      // Act
      const result = expenseService.addExpense(expense);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('1');
    });
  });
});
```

## Documentation

### README Updates

If your changes require documentation updates, please include them in your PR:

```bash
# Update README.md
# Update relevant sections with new features/changes
```

### Code Comments

```typescript
// Good: Explain WHY, not WHAT
// Split the amount equally between all budget categories
// to ensure fair distribution of remaining funds
const splitAmount = remainingAmount / categoryCount;

// Bad: Explains WHAT (obvious from code)
// Divide remainingAmount by categoryCount
const splitAmount = remainingAmount / categoryCount;
```

## Pull Request Process

1. **Before you start:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes:**
   - Follow the code style guidelines
   - Write meaningful commit messages
   - Add/update tests if needed
   - Update documentation if needed

3. **Before pushing:**
   ```bash
   npm run lint:fix
   npm run format
   npm test
   npm start  # Quick manual test
   ```

4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request with the template below:**

## PR Template

When opening a Pull Request, please use this format:

```
**What does this PR do?**
[Brief description of your changes]

**Why?**
[Reason and motivation for the change]

**Changes:**
- [Change 1]
- [Change 2]
- [Change 3]

**Testing:**
- [How you tested this feature]
- [Any edge cases you tested]

**Result:**
[Screenshots or summary of results]
```

### Example PR

```
**What does this PR do?**
Implements a dynamic bar chart visualization for expense statuses, including enhanced tooltips that display category names on hover.

**Why?**
To provide users with a quick, visual overview of their spending patterns and distribution, improving the dashboard's utility.

**Changes:**
- Added Chart.js library via CDN in index.html
- Created a styled chart container in components/ExpenseChart.tsx
- Implemented renderChart and updateChart methods to render and update data dynamically
- Enhanced chart tooltips to display specific expense categories
- Updated README.md to include the new "Visual Analytics" feature

**Testing:**
- Verified chart renders correctly on page load
- Verified chart updates dynamically when adding, editing, or deleting expenses
- Verified tooltips display correct categories on hover
- Checked responsiveness on mobile and desktop viewports

**Result:**
[Screenshot here]
```

## Review Process

- At least one maintainer will review your PR
- Address feedback and make requested changes
- PRs should be up-to-date with main before merging
- Maintainers will handle merging when approved

## Community

- **Questions?** Open a discussion or issue
- **Ideas?** Share them in the issues section
- **Found a bug?** Let us know with a detailed bug report
- **Want to chat?** Join our community (Discord/Slack - TBD)

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Guide](https://reactnative.dev/docs/getting-started)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Questions or Need Help?

- Check existing issues and discussions
- Create a new issue if you can't find an answer
- Reach out to the maintainers

---

Thank you for contributing! 🚀
