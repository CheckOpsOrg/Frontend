from PIL import Image

def remove_black_background(input_path, output_path, threshold=30):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # If the pixel is dark (r, g, b < threshold)
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            # Change the alpha to 0 (transparent), maintaining RGB just in case
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_black_background('C:/Users/sm70p/OneDrive/Documents/Projects/CheckOps-Frontend/src/assets/checkops_logo.png', 'C:/Users/sm70p/OneDrive/Documents/Projects/CheckOps-Frontend/src/assets/checkops_logo.png')
print('Background removed.')
