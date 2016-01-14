#Generate Unicode types


with open('unicode.txt') as f:
    lines = f.readlines()
    for line in lines:
        broken_lines = line.split(",")
        nums = broken_lines[0].split("-")
        name = broken_lines[1].rstrip('\n')
        start = nums[0]
        end = nums[1]
        item = "<li><a href=\"#\" ng-click=\"generateUnicode(" + start + \
                ", "+end + ")\">"+ name +"</a></li>"
        print item