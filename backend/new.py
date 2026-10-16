import sys

def solve(reference_day, accounts, transactions, merchants, device_activities, location_risks):

    # Store account, merchant and location details for quick lookup
    account_map = {a[0]: a for a in accounts}
    merchant_map = {m[0]: m for m in merchants}
    location_map = {l[0]: l for l in location_risks}

    # Store earliest day each device was used by an account
    device_map = {}
    for activity_id, acc_id, dev_id, first_used_day in device_activities:
        fud = int(first_used_day)

        # Ignore invalid records
        if acc_id not in account_map or fud < 1:
            continue

        key = (acc_id, dev_id)

        # Keep the earliest first-used day
        if key not in device_map or fud < device_map[key]:
            device_map[key] = fud

    # Filter only valid transactions
    valid = []
    for t in transactions:
        tid, acc_id, mer_id, dev_id, loc, day, amt, status, idx = t
        day = int(day)
        amt = int(amt)

        if acc_id not in account_map:
            continue
        if mer_id not in merchant_map:
            continue
        if loc not in location_map:
            continue
        if not (1 <= day <= reference_day):
            continue
        if amt <= 0:
            continue
        if status not in ("SUCCESS", "FAILED"):
            continue

        valid.append((tid, acc_id, mer_id, dev_id, loc, day, amt, status, idx))

    # Only successful transactions are analyzed
    success = [t for t in valid if t[7] == "SUCCESS"]

    # Calculate average transaction amount and transactions/day for every account
    acc_sum = {}
    acc_cnt = {}
    day_cnt = {}

    for t in success:
        acc = t[1]

        acc_sum[acc] = acc_sum.get(acc, 0) + t[6]
        acc_cnt[acc] = acc_cnt.get(acc, 0) + 1

        key = (acc, t[5])
        day_cnt[key] = day_cnt.get(key, 0) + 1

    results = []

    # Evaluate fraud score for every successful transaction
    for t in success:
        tid, acc_id, mer_id, dev_id, loc, day, amt, status, idx = t

        holder = account_map[acc_id][1]
        home_location = account_map[acc_id][3]

        avg_amount = acc_sum[acc_id] / acc_cnt[acc_id]
        same_day_transactions = day_cnt[(acc_id, day)]

        device_key = (acc_id, dev_id)
        unknown_device = device_key not in device_map
        future_device = (not unknown_device) and device_map[device_key] > day

        merchant_risk = merchant_map[mer_id][2]
        location_risk = int(location_map[loc][1])

        outside_home = (loc != home_location)

        score = 0

        # Amount is unusually high
        if amt > 2 * avg_amount:
            score += 4

        # Too many transactions on the same day
        if same_day_transactions >= 3:
            score += 3

        # Device never seen before
        if unknown_device:
            score += 4

        # Device first used after this transaction (suspicious)
        if future_device:
            score += 3

        # Merchant risk
        if merchant_risk == "HIGH":
            score += 3
        elif merchant_risk == "MEDIUM":
            score += 1

        # High-risk location
        if location_risk >= 4:
            score += 3

        # Transaction outside account's home location
        if outside_home:
            score += 2

        # Assign fraud level
        if score >= 10:
            level = "HIGH"
        elif score >= 6:
            level = "MEDIUM"
        else:
            level = "LOW"

        # Store only HIGH and MEDIUM fraud transactions
        if level != "LOW":
            results.append((tid, holder, level, score, amt, idx))

    # Sort:
    # 1. HIGH before MEDIUM
    # 2. Higher score first
    # 3. Higher amount first
    # 4. Original input order
    priority = {"HIGH": 0, "MEDIUM": 1}

    results.sort(
        key=lambda x: (
            priority[x[2]],
            -x[3],
            -x[4],
            x[5]
        )
    )
    # No suspicious transactions
    if not results:
        return "NA"
    # Required output format
    return "#".join(
        f"{tid}-{holder}-{level}-{score}"
        for tid, holder, level, score, amt, idx in results
    )


def main():
    input_data = sys.stdin.readline

    reference_day = int(input_data())

    account_count = int(input_data())
    transaction_count = int(input_data())
    merchant_count = int(input_data())
    device_count = int(input_data())
    location_count = int(input_data())

    # Read accounts
    accounts = []
    for idx in range(account_count):
        aid, holder, atype, home = input_data().split()
        accounts.append((aid, holder, atype, home, idx))

    # Read transactions
    transactions = []
    for idx in range(transaction_count):
        tid, aid, mid, did, loc, day, amt, status = input_data().split()
        transactions.append((tid, aid, mid, did, loc, day, amt, status, idx))

    # Read merchants
    merchants = []
    for _ in range(merchant_count):
        mid, category, tier = input_data().split()
        merchants.append((mid, category, tier))

    # Read device activities
    device_activities = []
    for _ in range(device_count):
        activity_id, aid, did, first_day = input_data().split()
        device_activities.append((activity_id, aid, did, first_day))

    # Read location risks
    location_risks = []
    for _ in range(location_count):
        location, score = input_data().split()
        location_risks.append((location, score))

    print(
        solve(
            reference_day,
            accounts,
            transactions,
            merchants,
            device_activities,
            location_risks
        )
    )


if __name__ == "__main__":
    main()