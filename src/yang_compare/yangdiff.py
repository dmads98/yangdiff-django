import subprocess
import requests

def fileCompare(oldvers, oldfile, newvers, newfile):
	diff_type = "normal"
	header = "false"
	create_yang_old_directory()
	create_yang_new_directory()
	create_output_directory()
	getAndOrModifyFiles(oldvers, oldfile, True)
	getAndOrModifyFiles(newvers, newfile, False)
	if (check_for_valid_files(oldfile[:-5] + "-" + oldvers, "yang_old") and check_for_valid_files(newfile[:-5], "yang_new")):
		subpr = subprocess.run([
			"yangdiff-pro",
			"--old=yang_old/" + oldfile[:-5] + "-" + oldvers + ".yang",
			"--new=yang_new/" + newfile,
			"--modpath=" + "yang_old:yang_new",
			"--difftype=" + diff_type,
			"--header=" + header], capture_output=True, text=True)
		output = subpr.stdout.strip('\n')
		if output.startswith("Error"):
			print("Error(s) occurred - Comparison unsuccessful")
			error = output[7:output.find("yangdiff")]
			error = error[:1].upper() + error[1:]
			error = error.strip('\n')
			print(error)
		else:
			file = open("diff_output/diff.txt", "w+")
			file.write(output)
			file.close()
			print(output)

def create_yang_old_directory():
	subpr = subprocess.run([
		"mkdir",
		"yang_old"])

def create_yang_new_directory():
	subpr = subprocess.run([
		"mkdir",
		"yang_new"])

def getAndOrModifyFiles(vers, file, old):
	file_list = [file[:-5]]
	completed = set()
	while file_list:
		cur = file_list.pop()
		if cur in completed:
			continue
		if old:
			f = open("yang_old/" + cur + "-" + vers + ".yang", "w+")
		else:
			f = open("yang_new/" + cur + ".yang", "w+")
		url = "https://raw.githubusercontent.com/YangModels/yang/master/vendor/cisco/xr/" + vers + "/" + cur + ".yang"
		content = requests.get(url)
		header_parsed = False
		filename_parsed = False
		for line in content.text.splitlines(True):
			if header_parsed or line.find("/***") != -1:
				f.write(line)
				continue
			if not filename_parsed:
				filename_parsed = True
				if old:
					f.write(modify_line(line, vers)[0])
				else:
					f.write(line)
				continue
			if line.find("import") != -1 or line.find("include") != -1 or line.find("belongs-to") != -1:
				tab = len(line) - len(line.lstrip())
				if old:
					result = modify_line(line[tab:], vers)
					file_list.append(result[1])
					f.write(line[:tab] + result[0])
				else:
					file_list.append(line[tab:].split()[1])
					f.write(line)
				continue
			if line.find("organization") >= 0:
				header_parsed = True
			f.write(line)
		f.close()
		completed.add(cur)

def modify_line(line, vers):
	words = line.split()
	file_name = words[1]
	words[1] = words[1] + "-" + vers
	words.append('\n')
	return [' '.join(words), file_name]

def create_output_directory():
	subpr = subprocess.run([
		"mkdir",
		"diff_output"])

def check_for_valid_files(file, dir_name):
	subpr = subprocess.run([
		"pyang", 
		"-f", 
		"tree", 
		dir_name + "/" + file + ".yang",  
		"-p",
		dir_name], capture_output=True, text=True)
	if subpr.stderr != "":
		print("Error(s) occurred - File set invalid")
		index = subpr.stderr.find("]")
		if index != -1:
			print((subpr.stderr[index + 2:]).strip('\n'))
			return False
		errors = subpr.stderr.splitlines()
		for line in errors:
			line = line[line.find("error: ") + 7:]
			line = line[:1].upper() + line[1:]
			if not line.startswith("Module"):
				print("    ", line)
			else:
				print(line)
		return False
	output = subpr.stdout.strip('\n')
	if output == "":
		print("Please select a primary module to compare. You have selected a submodule or types file." +
			"\nA node tree cannot be constructed from this file.")
		return False
	return True

if __name__ == "__main__":
	oldvers = "633"
	oldfile = "Cisco-IOS-XR-cdp-oper.yang"
	newvers = "652"
	newfile = "Cisco-IOS-XR-cdp-oper.yang"
	fileCompare(oldvers, oldfile, newvers, newfile)

