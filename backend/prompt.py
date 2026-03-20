from collections import defaultdict


def build_prompt(menu, orders, reviews, user_question):
    """
    AI Smart Menu & Recipe Optimization Agent

    Core purpose:
    - Analyses menu data, order volumes, and customer feedback together
    - Retrieves ingredient availability from menu data
    - Generates optimized menu recommendations and recipe variations
    - Acts as LLM-as-Judge to classify dish performance
    - Suggests profitable menu changes in real time

    Question types handled:
    - SIMPLE      : Direct short answer (list, count, show me)
    - INSIGHT     : Strategic single answer (biggest problem, compare, plan)
    - SHORTAGE    : Ingredient low stock or supply issue
    - RECIPE      : Recipe variation or ingredient substitution
    - RECOMMENDATION: What to promote, outlet specific, time slot
    - FULL        : Complete dish classification and breakdown
    """

    # =========================================================
    # STEP 1 - AGGREGATE ORDER DATA IN PYTHON
    # Never let LLM calculate totals - Python is source of truth
    # =========================================================

    dish_order_totals    = defaultdict(int)
    dish_revenue_totals  = defaultdict(int)
    dish_outlet_orders   = defaultdict(lambda: defaultdict(int))
    dish_timeslot_orders = defaultdict(lambda: defaultdict(int))

    for o in orders:
        dish_name = o.get("dish_name", "")
        outlet    = o.get("outlet", "")
        count     = int(o.get("order_count", 0))
        revenue   = int(o.get("revenue", 0))
        slot      = o.get("time_slot", "")

        dish_order_totals[dish_name]            += count
        dish_revenue_totals[dish_name]          += revenue
        dish_outlet_orders[dish_name][outlet]   += count
        dish_timeslot_orders[dish_name][slot]   += count

    # =========================================================
    # STEP 2 - AGGREGATE REVIEW DATA IN PYTHON
    # =========================================================

    dish_ratings    = defaultdict(list)
    dish_sentiments = defaultdict(list)
    dish_comments   = defaultdict(list)

    for r in reviews:
        dish_name = r.get("dish_name", "")
        rating    = float(r.get("rating", 0))
        sentiment = r.get("sentiment", "")
        comment   = r.get("comment", "")

        dish_ratings[dish_name].append(rating)
        dish_sentiments[dish_name].append(sentiment)
        dish_comments[dish_name].append(comment)

    dish_avg_ratings = {}
    for dish_name, ratings_list in dish_ratings.items():
        dish_avg_ratings[dish_name] = round(
            sum(ratings_list) / len(ratings_list), 2
        )

    # =========================================================
    # STEP 3 - STRICT TIER CLASSIFICATION IN PYTHON
    # STAR       : orders >= 100 AND rating >= 4.0
    # SLEEPER    : orders <  100 AND rating >= 3.8
    # WATCH      : orders <  100 AND 3.5 <= rating < 3.8
    # PROBLEM    : orders >= 30  AND rating < 3.5
    # DEADWEIGHT : orders <  30  AND rating < 3.5
    # PAUSED     : is_available = False
    # =========================================================

    dish_tiers = {}

    for d in menu:
        dish_name    = d.get("dish_name", "")
        is_available = d.get("is_available", True)

        if not is_available:
            dish_tiers[dish_name] = "PAUSED"
            continue

        total_orders = dish_order_totals.get(dish_name, 0)
        avg_rating   = dish_avg_ratings.get(dish_name, 0.0)

        if total_orders >= 100 and avg_rating >= 4.0:
            dish_tiers[dish_name] = "STAR"
        elif total_orders < 100 and avg_rating >= 3.8:
            dish_tiers[dish_name] = "SLEEPER"
        elif total_orders < 100 and 3.5 <= avg_rating < 3.8:
            dish_tiers[dish_name] = "WATCH"
        elif total_orders >= 30 and avg_rating < 3.5:
            dish_tiers[dish_name] = "PROBLEM"
        else:
            dish_tiers[dish_name] = "DEADWEIGHT"

    # =========================================================
    # STEP 4 - BUILD INGREDIENT MAP
    # Used for shortage and recipe variation logic
    # =========================================================

    ingredient_to_dishes = defaultdict(list)
    dish_ingredients     = {}

    for d in menu:
        dish_name   = d.get("dish_name", "")
        ingredients = d.get("ingredients", [])
        dish_ingredients[dish_name] = ingredients
        for ing in ingredients:
            ingredient_to_dishes[ing.lower()].append(dish_name)

    # =========================================================
    # STEP 5 - QUESTION TYPE CLASSIFIER
    # =========================================================

    q = user_question.lower()

    simple_keywords = [
        "how many", "list all", "what are",
        "show me the menu", "show me all",
        "full menu", "beverage options",
        "snack options", "meal options",
        "combo options", "which dishes are available",
        "what is available", "total dishes",
        "how much does", "what is the price",
        "all dishes", "show menu"
    ]

    insight_keywords = [
        "biggest problem", "single biggest",
        "main issue", "worst problem",
        "top priority", "most urgent",
        "right now", "overall situation",
        "at a glance", "what is wrong",
        "key issue", "most important",
        "critical issue", "in general",
        "compare", " vs ", "versus",
        "better to promote", "which is better",
        "keep only", "if i could keep",
        "revenue impact", "if we remove",
        "percentage", "how many percent",
        "which category performs",
        "vegetarian vs", "best return",
        "worst customer", "happiest customer",
        "most consistent", "overall"
    ]

    shortage_keywords = [
        "stock is low", "running low",
        "out of stock", "shortage",
        "ingredient low", "supply delayed",
        "stock issue", "ran out",
        "supply is low", "delayed",
        "supply chain", "no stock",
        "not enough", "low supply"
    ]

    recipe_keywords = [
        "recipe", "variation", "substitute",
        "alternative ingredient", "replace ingredient",
        "modify recipe", "change recipe",
        "new recipe", "recipe change",
        "ingredient swap", "recipe suggestion",
        "recipe idea", "can we make",
        "how to make", "modify the dish",
        "recipe for", "without the"
    ]

    full_keywords = [
        "classify", "tier", "categorize",
        "analyse all", "analyze all",
        "performance breakdown",
        "star dishes", "sleeper dishes",
        "problem dishes", "deadweight",
        "full analysis", "complete analysis",
        "full report", "complete report",
        "action plan", "weekly plan",
        "full action", "this week plan",
        "all 12", "every dish"
    ]

    recommendation_keywords = [
        "promote", "should we", "what should",
        "best selling", "top dishes",
        "remove from menu", "action",
        "increase revenue", "improve sales",
        "suggest", "outlet", "today",
        "this week", "recommend",
        "which dishes to", "what to push",
        "evening", "morning", "afternoon",
        "time slot", "weekend", "special"
    ]

    if any(kw in q for kw in shortage_keywords):
        question_type = "SHORTAGE"
    elif any(kw in q for kw in recipe_keywords):
        question_type = "RECIPE"
    elif any(kw in q for kw in full_keywords):
        question_type = "FULL"
    elif any(kw in q for kw in insight_keywords):
        question_type = "INSIGHT"
    elif any(kw in q for kw in recommendation_keywords):
        question_type = "RECOMMENDATION"
    elif any(kw in q for kw in simple_keywords):
        question_type = "SIMPLE"
    else:
        question_type = "INSIGHT"

    # =========================================================
    # STEP 6 - FORMAT MENU DATA WITH ALL AGGREGATIONS
    # =========================================================

    menu_summary_lines = []
    for d in menu:
        dish_name    = d.get("dish_name", "")
        category     = d.get("category", "")
        sell         = d.get("selling_price", "")
        margin       = d.get("profit_margin", "")
        is_available = d.get("is_available", True)
        ingredients  = ", ".join(d.get("ingredients", []))
        total_orders = dish_order_totals.get(dish_name, 0)
        total_rev    = dish_revenue_totals.get(dish_name, 0)
        avg_rating   = dish_avg_ratings.get(dish_name, "N/A")
        tier         = dish_tiers.get(dish_name, "UNCLASSIFIED")

        outlet_dict  = dish_outlet_orders.get(dish_name, {})
        outlet_parts = [
            f"{outlet}: {cnt} orders"
            for outlet, cnt in sorted(
                outlet_dict.items(),
                key=lambda x: x[1],
                reverse=True
            )
        ]
        outlet_text  = " | ".join(outlet_parts) if outlet_parts else "No orders"

        slot_dict    = dish_timeslot_orders.get(dish_name, {})
        top_slot     = max(slot_dict, key=slot_dict.get) if slot_dict else "N/A"

        sentiments   = dish_sentiments.get(dish_name, [])
        pos_count    = sentiments.count("Positive")
        neg_count    = sentiments.count("Negative")
        neu_count    = sentiments.count("Neutral")

        comments     = dish_comments.get(dish_name, [])
        sample_comments = " || ".join(comments[:2]) if comments else "No reviews"

        status = "AVAILABLE" if is_available else "PAUSED"

        menu_summary_lines.append(
            f"\n[{dish_name}]"
            f"\n  Category   : {category}"
            f"\n  Status     : {status}"
            f"\n  Price      : Rs.{sell} | Margin: {margin}%"
            f"\n  Ingredients: {ingredients}"
            f"\n  TIER       : {tier}"
            f"\n  Orders     : {total_orders} total"
            f"\n  Revenue    : Rs.{total_rev}"
            f"\n  Avg Rating : {avg_rating}"
            f"\n  Outlets    : {outlet_text}"
            f"\n  Peak Slot  : {top_slot}"
            f"\n  Sentiment  : {pos_count} Positive | "
            f"{neg_count} Negative | {neu_count} Neutral"
            f"\n  Reviews    : {sample_comments}"
        )

    menu_data_text = "\n".join(menu_summary_lines)

    # Pre-computed summary block
    total_revenue_all = sum(dish_revenue_totals.values())
    total_orders_all  = sum(dish_order_totals.values())

    star_dishes       = [d for d, t in dish_tiers.items() if t == "STAR"]
    sleeper_dishes    = [d for d, t in dish_tiers.items() if t == "SLEEPER"]
    watch_dishes      = [d for d, t in dish_tiers.items() if t == "WATCH"]
    problem_dishes    = [d for d, t in dish_tiers.items() if t == "PROBLEM"]
    deadweight_dishes = [d for d, t in dish_tiers.items() if t == "DEADWEIGHT"]
    paused_dishes     = [d for d, t in dish_tiers.items() if t == "PAUSED"]

    summary_block = f"""
PRE-COMPUTED SUMMARY (Python calculated - use these exact numbers)
------------------------------------------------------------------
Total Orders Today   : {total_orders_all}
Total Revenue Today  : Rs.{total_revenue_all}
Total Menu Items     : {len(menu)}
Available Items      : {len([d for d in menu if d.get('is_available', True)])}
Paused Items         : {len(paused_dishes)}

TIER DISTRIBUTION:
STAR       ({len(star_dishes)}) : {', '.join(star_dishes) if star_dishes else 'None'}
SLEEPER    ({len(sleeper_dishes)}) : {', '.join(sleeper_dishes) if sleeper_dishes else 'None'}
WATCH      ({len(watch_dishes)}) : {', '.join(watch_dishes) if watch_dishes else 'None'}
PROBLEM    ({len(problem_dishes)}) : {', '.join(problem_dishes) if problem_dishes else 'None'}
DEADWEIGHT ({len(deadweight_dishes)}) : {', '.join(deadweight_dishes) if deadweight_dishes else 'None'}
PAUSED     ({len(paused_dishes)}) : {', '.join(paused_dishes) if paused_dishes else 'None'}
"""

    # =========================================================
    # STEP 7 - BUILD PROMPT BY QUESTION TYPE
    # =========================================================

    # ----------------------------------------------------------
    # SIMPLE
    # ----------------------------------------------------------
    if question_type == "SIMPLE":
        prompt = f"""You are an AI Restaurant Menu Assistant.
Answer the user question directly and concisely.
Do NOT include dish performance analysis.
Do NOT include tier classifications.
Do NOT include TOP 3 ACTIONS.
Keep response to maximum 8 lines.
Always prefix prices with Rs. symbol.

=== MENU DATA ===
{menu_data_text}

{summary_block}

=== USER QUESTION ===
{user_question}

Answer directly now in bullet points if listing items.
Use actual numbers from the data only."""

    # ----------------------------------------------------------
    # INSIGHT
    # ----------------------------------------------------------
    elif question_type == "INSIGHT":
        prompt = f"""You are an AI Restaurant Intelligence Agent.
A real-time agent that reviews menu data, ingredient availability,
and customer feedback to identify the most important insight.

Your core purpose:
- Analyse menu data, sales inputs, and customer feedback together
- Identify the single most important insight for this question
- Suggest profitable changes based on real numbers
- Be concise and direct - no unnecessary dish dumps

=== RESTAURANT DATA ===
{menu_data_text}

{summary_block}

=== USER QUESTION ===
{user_question}

=== RESPONSE RULES ===
- Answer the question in maximum 12 lines
- Lead with the single most important insight immediately
- Back it up with 2 to 3 specific data points and numbers
- End with ONE clear recommended action
- Do NOT list all dishes
- Only mention dishes directly relevant to the answer
- Always use Rs. symbol for prices
- Use only computed numbers from the summary block above

Format:
INSIGHT
-------
[Direct answer in 1 to 2 sentences with the key finding]

KEY DATA
--------
- [Data point 1 with specific numbers]
- [Data point 2 with specific numbers]
- [Data point 3 with specific numbers]

RECOMMENDED ACTION
------------------
[One clear specific action to take immediately]"""

    # ----------------------------------------------------------
    # SHORTAGE
    # ----------------------------------------------------------
    elif question_type == "SHORTAGE":

        mentioned_ingredient = None
        for ing in ingredient_to_dishes.keys():
            if ing in q:
                mentioned_ingredient = ing
                break

        if mentioned_ingredient:
            affected_dishes  = ingredient_to_dishes[mentioned_ingredient]
            affected_orders  = sum(
                dish_order_totals.get(d, 0) for d in affected_dishes
            )
            affected_revenue = sum(
                dish_revenue_totals.get(d, 0) for d in affected_dishes
            )

            outlet_impact = defaultdict(int)
            for dish in affected_dishes:
                for outlet, cnt in dish_outlet_orders[dish].items():
                    outlet_impact[outlet] += cnt
            top_outlet = max(
                outlet_impact, key=outlet_impact.get
            ) if outlet_impact else "Unknown"

            affected_categories = [
                d.get("category", "")
                for d in menu
                if d.get("dish_name", "") in affected_dishes
            ]
            substitute_dishes = [
                d.get("dish_name", "")
                for d in menu
                if d.get("is_available", True)
                and d.get("dish_name", "") not in affected_dishes
                and d.get("category", "") in affected_categories
                and dish_tiers.get(
                    d.get("dish_name", ""), ""
                ) in ["STAR", "SLEEPER", "WATCH"]
            ]

            shortage_context = f"""
SHORTAGE IMPACT (Python computed)
-----------------------------------
Affected Ingredient : {mentioned_ingredient}
Affected Dishes     : {', '.join(affected_dishes)}
Total Orders at Risk: {affected_orders}
Revenue at Risk     : Rs.{affected_revenue}
Most Impacted Outlet: {top_outlet}
Best Substitutes    : {', '.join(substitute_dishes) if substitute_dishes else 'Check other available dishes'}
"""
        else:
            shortage_context = ""

        prompt = f"""You are an AI Restaurant Menu Optimization Agent.
A real-time agent that reviews ingredient availability and
generates optimized menu recommendations and recipe variations
when stock is affected.

=== RESTAURANT DATA ===
{menu_data_text}

{summary_block}

{shortage_context}

=== USER QUESTION ===
{user_question}

=== SHORTAGE RESPONSE RULES ===
- Do NOT suggest promoting the affected dish while stock is low
- Do NOT dump full dish analysis
- Focus ONLY on shortage impact and recovery actions
- Suggest specific substitute dishes to promote instead
- Suggest recipe variations using less of the affected ingredient
- Alert which outlet needs immediate attention
- TOP 3 ACTIONS must be shortage-specific only

Format exactly as:

INGREDIENT IMPACT
-----------------
[Which dishes are affected and total orders at risk]
[Revenue at risk and most impacted outlet]

IMMEDIATE ACTIONS
-----------------
1. [What to do about the affected dishes right now]
2. [Which outlet to alert first and why]
3. [How to handle customer demand during shortage]

SUBSTITUTE DISHES TO PROMOTE
------------------------------
1. [Dish] - Rs.[price] | [margin]% margin | [orders] orders | [reason]
2. [Dish] - Rs.[price] | [margin]% margin | [orders] orders | [reason]
3. [Dish] - Rs.[price] | [margin]% margin | [orders] orders | [reason]

RECIPE VARIATION SUGGESTION
----------------------------
[How to modify affected dish to use less of the ingredient
 or use a substitute ingredient to keep it available]

TOP 3 ACTIONS FOR TODAY
------------------------
1. [Shortage-specific action with dish name]
2. [Shortage-specific action with dish name]
3. [Shortage-specific action with dish name]

Use Rs. for prices. Use actual numbers only."""

    # ----------------------------------------------------------
    # RECIPE
    # ----------------------------------------------------------
    elif question_type == "RECIPE":
        prompt = f"""You are an AI Restaurant Recipe Optimization Agent.
You analyse menu data, ingredient availability, and customer feedback
to generate optimized recipe variations using LLM reasoning.

=== MENU DATA WITH INGREDIENTS ===
{menu_data_text}

{summary_block}

=== USER QUESTION ===
{user_question}

=== RECIPE RESPONSE RULES ===
- Analyse ingredients of the relevant dish carefully
- Suggest practical recipe variations based on available ingredients
- Consider profit margin impact of any substitution
- Reference customer feedback trends when suggesting changes
- Only focus on the dish or ingredient asked about
- Do NOT dump full dish analysis

Format as:

CURRENT RECIPE ANALYSIS
-----------------------
[Dish name | ingredients | margin | rating | customer sentiment]

SUGGESTED VARIATION
-------------------
[What to change and why]
[Margin impact: higher / lower / same - explain]
[Customer experience impact: explain]

SIMILAR SUCCESSFUL DISHES FOR REFERENCE
-----------------------------------------
[Other dishes with similar ingredients performing well]

RECOMMENDATION
--------------
[Clear go or no-go decision with specific reason]
[Expected outcome if variation is implemented]"""

    # ----------------------------------------------------------
    # RECOMMENDATION
    # ----------------------------------------------------------
    elif question_type == "RECOMMENDATION":
        prompt = f"""You are an AI Restaurant Menu Optimization Agent.
You review menu data, ingredient availability, order volumes,
and customer feedback to recommend the most profitable actions.

=== RESTAURANT DATA ===
{menu_data_text}

{summary_block}

=== USER QUESTION ===
{user_question}

=== RECOMMENDATION RULES ===
- Only include dishes directly relevant to the question
- If outlet specific: focus on that outlet's data only
- If time slot specific: use peak slot data per dish
- Back every recommendation with specific numbers
- Always include margin percentage in recommendations
- Always use Rs. symbol for prices
- Do NOT include dishes unrelated to the question
- Do NOT dump all 12 dishes

Format as:

ANALYSIS
--------
[3 to 5 most relevant dishes only]
[Dish | Orders | Rating | Margin | Best outlet]

RECOMMENDATION
--------------
[Direct answer to the question]
[Outlet-specific insights where relevant]
[Recipe variation suggestions where relevant]

TOP 3 ACTIONS FOR TODAY
------------------------
1. [Specific action directly related to the question]
2. [Specific action directly related to the question]
3. [Specific action directly related to the question]

Use Rs. for prices. Use actual numbers only."""

    # ----------------------------------------------------------
    # FULL
    # ----------------------------------------------------------
    else:
        prompt = f"""You are an AI Restaurant Menu Optimization Agent
acting as an LLM-as-Judge.

Core purpose:
- Analyse menu and sales inputs together
- Retrieve ingredient data from menu records
- Generate optimized menu recommendations and recipe variations
- Classify every dish using pre-computed Python tiers
- Suggest profitable menu changes based on real data

CRITICAL RULES:
- Use ONLY the pre-classified tiers provided below
- Use ONLY the Python-computed order totals
- Never recalculate or reclassify on your own
- Always use Rs. symbol for prices

=== COMPLETE RESTAURANT DATA ===
{menu_data_text}

{summary_block}

=== USER QUESTION ===
{user_question}

=== FULL ANALYSIS RULES ===

Tier to Action mapping - use exactly as shown:
STAR       -> PROMOTE NOW     | Urgency: IMMEDIATE
SLEEPER    -> MARKET MORE     | Urgency: THIS WEEK
WATCH      -> MONITOR CLOSELY | Urgency: THIS WEEK
PROBLEM    -> FIX RECIPE      | Urgency: THIS WEEK
DEADWEIGHT -> REVIEW REMOVAL  | Urgency: STRATEGIC
PAUSED     -> Skip unless user specifically asked

For every available dish include:
- Outlet breakdown (which outlet performs best)
- Peak time slot
- Sentiment summary (positive / negative / neutral count)
- Specific reason with actual numbers

Format EXACTLY as:

---
DISH PERFORMANCE ANALYSIS
--------------------------
[Dish Name] | Tier: [TIER] | Action: [ACTION] | Urgency: [URGENCY]
Reason: orders: X total | rating: X.X avg | margin: X% |
top outlet: [name] with X orders | peak slot: [slot] |
sentiment: X positive, X negative

(Repeat for every AVAILABLE dish)
(Skip PAUSED dishes unless asked)

---
RECOMMENDATION FOR YOUR QUESTION
----------------------------------
[Detailed direct answer using real data]
[Outlet-specific insights included]
[Recipe variation suggestions where relevant]
[All prices prefixed with Rs.]

---
TOP 3 ACTIONS FOR TODAY
------------------------
1. [Specific action with dish name and numbers]
2. [Specific action with dish name and numbers]
3. [Specific action with dish name and numbers]
---"""

    return prompt