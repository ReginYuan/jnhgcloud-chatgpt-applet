module.exports = {
  extends: ["@commitlint/config-conventional"],
  prompt: {
    settings: {},
    messages: {
      skip: "可跳过",
      max: "最多 %d 字符",
      min: "最少 %d 字符",
      emptyWarning: "不能为空",
      upperLimitWarning: "over limit",
      lowerLimitWarning: "below limit",
    },
    questions: {
      type: {
        description: "请选择提交类型",
        enum: {
          feat: {
            description: "✨新的功能",
            title: "Features",
            emoji: "✨",
          },
          fix: {
            description: "🐛修复Bug",
            title: "Bug Fixes",
            emoji: "🐛",
          },
          docs: {
            description: "📚文档修改",
            title: "Documentation",
            emoji: "📚",
          },
          style: {
            description: "💎代码格式(不影响代码运行的变动)",
            title: "Styles",
            emoji: "💎",
          },
          refactor: {
            description: "📦重构(既不是增加feature，也不是修复bug)",
            title: "Code Refactoring",
            emoji: "📦",
          },
          perf: {
            description: "🚀性能优化",
            title: "Performance Improvements",
            emoji: "🚀",
          },
          test: {
            description: "🚨增加测试",
            title: "Tests",
            emoji: "🚨",
          },
          build: {
            description: "🛠打包",
            title: "Builds",
            emoji: "🛠",
          },
          chore: {
            description: "🪛构建过程或辅助工具的变动",
            title: "Chores",
            emoji: "🪛",
          },
          revert: {
            description: "🗑回退",
            title: "Reverts",
            emoji: "🗑",
          },
          ci: {
            description: "🔨CI相关配置文件或脚本的修改",
            title: "CI",
            emoji: "🔨",
          },
        },
      },
      scope: {
        description: "修改影响的范围 (例如：组件或文件名)",
      },
      subject: {
        description: "请简要描述提交(必填)",
      },
      body: {
        description: "请输入详细描述(可选)",
      },
      isBreaking: {
        description: "本次提交是否为重大变更？",
      },
      breakingBody: {
        description: "请输入本次重大变更的详细描述(可选)",
      },
      breaking: {
        description: "请简要描述重大变更(可选)",
      },
      isIssueAffected: {
        description: "这些变更是否影响议题?",
      },
      issuesBody: {
        description: "如果提议已经关闭，请详细描述一下",
      },
      issues: {
        description: '关联议题 (例如： "feat/#123", "fix/#123".)',
      },
    },
  },
};
