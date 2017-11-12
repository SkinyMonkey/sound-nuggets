from sys import argv
import re
import inflection
from subprocess import call

def camelize(s):
    return ''.join(map(lambda (index, x): x.capitalize() if index > 0 else x, enumerate(s.split('_'))))

def main():
    for filename in argv[1:]:
        with open(filename) as f:
            with open(filename + '.e', 'w') as of:
                for line in f.readlines():
                    camelized = inflection.camelize(line);
                    if camelized[0] != line[0]:
                        camelized = line[0] + camelized[1:]
#                    print camelized,
                    of.write(camelized)
            call(["mv", filename + '.e', filename])

if __name__ == '__main__':
    main()
