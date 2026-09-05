#!/bin/bash

# ACT Claude Skills - Interactive Menu
# Makes it easy to discover and run skills

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ACT CLAUDE SKILLS - LAUNCHER                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to show skill details
show_skill_details() {
    local skill_name=$1
    local skill_dir=".claude/skills/$skill_name"

    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}SKILL:${NC} $skill_name"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    if [ -f "$skill_dir/SKILL.md" ]; then
        # Extract description from frontmatter
        description=$(grep "^description:" "$skill_dir/SKILL.md" | sed 's/description: //')
        echo -e "${YELLOW}Description:${NC}"
        echo "$description" | fold -s -w 60 | sed 's/^/  /'
        echo ""

        # Extract "When to Use" section
        echo -e "${YELLOW}When to Use:${NC}"
        sed -n '/^## When to Use/,/^##/p' "$skill_dir/SKILL.md" | grep "^-" | head -5 | sed 's/^/  /'
        echo ""

        echo -e "${YELLOW}How to Invoke:${NC}"
        echo -e "  ${GREEN}/${skill_name}${NC}"
        echo -e "  or mention \"$skill_name\" in conversation"
        echo ""
    else
        echo "  No SKILL.md found"
        echo ""
    fi
}

# Main menu
while true; do
    echo ""
    echo "Available Skills:"
    echo ""
    echo "  1. act-brand-alignment     - Brand, content, voice for all ACT projects"
    echo "  2. ghl-crm-advisor         - CRM strategy, pipelines, automation"
    echo "  3. act-knowledge-base      - Knowledge extraction & management (in dev)"
    echo ""
    echo "  4. View all skills"
    echo "  5. Open SKILLS_GUIDE.md"
    echo "  6. Quit"
    echo ""
    echo -n "Choose an option (1-6): "
    read choice

    case $choice in
        1)
            show_skill_details "act-brand-alignment"
            echo -n "Press Enter to continue..."
            read
            ;;
        2)
            show_skill_details "ghl-crm-advisor"
            echo -n "Press Enter to continue..."
            read
            ;;
        3)
            show_skill_details "act-knowledge-base"
            echo -n "Press Enter to continue..."
            read
            ;;
        4)
            echo ""
            echo -e "${GREEN}All Available Skills:${NC}"
            echo ""
            for skill_dir in .claude/skills/*/; do
                if [ -d "$skill_dir" ] && [ -f "${skill_dir}SKILL.md" -o -f "${skill_dir}skill.md" ]; then
                    skill_name=$(basename "$skill_dir")
                    # Skip special directories
                    if [ "$skill_name" != "dist" ]; then
                        description=$(grep "^description:" "${skill_dir}"*SKILL.md 2>/dev/null | head -1 | sed 's/description: //' | cut -c 1-50)
                        echo -e "  ${BLUE}${skill_name}${NC}"
                        echo "    $description..."
                        echo ""
                    fi
                fi
            done
            echo -n "Press Enter to continue..."
            read
            ;;
        5)
            if command -v code &> /dev/null; then
                code .claude/SKILLS_GUIDE.md
                echo "Opening SKILLS_GUIDE.md in VS Code..."
            elif command -v open &> /dev/null; then
                open .claude/SKILLS_GUIDE.md
                echo "Opening SKILLS_GUIDE.md..."
            else
                cat .claude/SKILLS_GUIDE.md
            fi
            echo ""
            echo -n "Press Enter to continue..."
            read
            ;;
        6)
            echo ""
            echo "Happy skill-using! 🚀"
            echo ""
            exit 0
            ;;
        *)
            echo ""
            echo "Invalid choice. Please choose 1-6."
            sleep 1
            ;;
    esac
done
