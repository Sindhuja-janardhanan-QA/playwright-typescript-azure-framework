# Playwright TypeScript Azure Framework

Senior-level E2E & API automation framework using Playwright, TypeScript, and Page Object Model. Includes Azure DevOps CI/CD integration and enterprise-grade testing patterns.

## 🚀 Features

- **Page Object Model**: Clean, maintainable test architecture with BasePage abstraction
- **Data-Driven Testing**: JSON-based test data management with dynamic test generation
- **API Testing**: Comprehensive API client with CRUD operations and error handling
- **API-UI Chaining**: Advanced patterns for validating data consistency across layers
- **TypeScript**: Full type safety and modern JavaScript features
- **Enterprise CI/CD**: Azure DevOps pipeline with cross-browser testing
- **Professional Reporting**: HTML reports, JUnit integration, and test artifacts

## 📁 Project Structure

```
├── src/
│   ├── pages/          # Page Object Model
│   │   └── BasePage.ts # Base page with wrapped Playwright actions
│   ├── api/           # API testing layer
│   │   └── UserClient.ts # API client with CRUD operations
│   ├── data/          # Test data management
│   │   └── users.json # Data-driven test scenarios
│   └── utils/         # Utility functions
├── tests/
│   └── e2e/          # Test files
│       ├── login.test.ts # Basic login tests
│       ├── data-driven-login.test.ts # Data-driven examples
│       └── api-ui-hybrid.test.ts # API-UI integration tests
├── playwright.config.ts # Playwright configuration
├── tsconfig.json      # TypeScript configuration
├── azure-pipelines.yml # Azure DevOps CI/CD pipeline
└── package.json       # Dependencies and scripts
```

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Sindhuja-janardhanan-QA/playwright-typescript-azure-framework.git
cd playwright-typescript-azure-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests
npm test
```

## 🧪 Running Tests

### Local Testing
```bash
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# TypeScript type checking
npm run type-check
```

## 🔄 CI/CD Integration

### Azure DevOps Pipeline

This framework is **pipeline-ready** with comprehensive Azure DevOps integration. The `azure-pipelines.yml` provides:

#### **Multi-Stage Pipeline**
- **Build & Test**: Node.js setup, dependency installation, test execution
- **Cross-Browser Testing**: Parallel execution on Chrome, Firefox, Safari
- **Security & Quality**: Vulnerability scanning, code quality checks
- **Optional Deployment**: Staging environment deployment (commented for demo)

#### **Pipeline Features**
- ✅ **Automatic Triggers**: Main branch, PRs, version tags
- ✅ **Multi-Agent Support**: Ubuntu agents with cross-browser compatibility
- ✅ **Dependency Management**: Automated npm and Playwright browser installation
- ✅ **Quality Gates**: TypeScript checking, ESLint, security scanning
- ✅ **Test Reporting**: JUnit integration for Azure DevOps Tests tab
- ✅ **Artifact Publishing**: HTML reports, screenshots, test results
- ✅ **Cross-Browser Matrix**: Parallel execution across browsers
- ✅ **Error Handling**: Graceful failure handling and detailed logging

#### **Setup Instructions**

1. **Create Azure DevOps Project**
   ```bash
   # Connect your repository to Azure DevOps
   # Repository → Build and Release → New Pipeline
   # Select "Existing Azure Pipelines YAML file"
   # Choose azure-pipelines.yml from your repository
   ```

2. **Configure Pipeline Variables**
   ```yaml
   # Default variables in azure-pipelines.yml:
   NODE_VERSION: '20.x'
   CI: 'true'
   ```

3. **Enable Test Results**
   - Tests automatically appear in Azure DevOps **Tests** tab
   - HTML reports available as build artifacts
   - Screenshots and videos captured on failure

4. **Monitor Pipeline**
   - Real-time test execution logs
   - Cross-browser test results matrix
   - Security vulnerability reports
   - Performance metrics and trends

#### **Pipeline Outputs**
- **Test Results**: JUnit format integrated with Azure DevOps
- **HTML Reports**: Interactive Playwright reports as artifacts
- **Screenshots**: Failure screenshots for debugging
- **Videos**: Test execution videos on failure
- **Coverage Reports**: Test coverage metrics (when configured)
- **Security Reports**: npm audit vulnerability reports

#### **Customization Options**
```yaml
# Modify azure-pipelines.yml for your needs:
# - Change agent OS (windows-latest, macos-latest)
# - Add environment-specific configurations
# - Configure deployment stages
# - Add custom test reporting
# - Integrate with external tools
```

## 📊 Test Examples

### Data-Driven Testing
```typescript
// Automatically generates tests for each user in JSON data
usersData.forEach((user, index) => {
  test(`Login test for ${user.userType} user: ${user.description}`, async ({ page }) => {
    // Test implementation with dynamic assertions
  });
});
```

### API-UI Chaining
```typescript
// Step 1: Create data via API
const createdPost = await apiClient.createPost(postData);

// Step 2: Verify in UI
await page.goto(`/posts/${createdPost.id}`);
await expect(page.locator('.post-title')).toHaveText(createdPost.title);
```

### Error Handling
```typescript
try {
  await apiClient.getPost(invalidId);
} catch (error) {
  expect(error).toBeInstanceOf(APIError);
  expect(error.status).toBe(404);
}
```

## 🔧 Configuration

### Playwright Configuration
- **Parallel Execution**: Enabled for optimal performance
- **Retry Logic**: 2 retries for flaky tests
- **Multiple Browsers**: Chrome, Firefox, Safari, Mobile
- **Reporting**: HTML, JSON, JUnit formats
- **Screenshots/Videos**: Automatic capture on failure

### TypeScript Configuration
- **Strict Mode**: Full type safety
- **Path Aliases**: Clean import statements
- **Modern ES**: ES2020 target with latest features

## 📈 Best Practices Demonstrated

- **Page Object Model**: Maintainable test architecture
- **Data-Driven Testing**: Scalable test data management
- **API Testing**: Backend validation with error handling
- **CI/CD Integration**: Enterprise-grade pipeline setup
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive exception management
- **Reporting**: Multi-format test results
- **Performance**: Parallel execution and optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Senior-Level SDET Showcase

This framework demonstrates enterprise-level SDET capabilities:
- **Architecture**: Scalable, maintainable test design
- **Automation**: End-to-end testing workflows
- **Integration**: CI/CD pipeline with cross-browser testing
- **Quality**: Code quality gates and security scanning
- **Reporting**: Comprehensive test result management
- **Documentation**: Clear setup and usage instructions

Perfect for SDET portfolio interviews and enterprise testing roles!
